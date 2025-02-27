# 欲練此功

## 爲什麼要寫這個框架

因爲我笨，無法學會使用 actix-web 等現存的框架.當我想把以前的 go 的 web 服務使用 rust 實現時，一眼看去，似乎每個框架都比 go 裏存在框架複雜, 本來 Rust 的學習曲線就夠陡峭的了, 又何苦把 Web 框架整得那麼複雜?

## 如何做到足夠簡單
很多底層的實現 Hyper 都已經實現，所以，一般需求，基於 Hyper 實現應該沒有錯.Salvo 也是一樣. 核心功能是提供還用簡單的API，以及一個功能強大並且靈活的路由系統.

Salvo 裏統一了 Handler 和 Middleware. Middleware 就是 Handler. 通過路由的 hoop 添加到 Router 上.本質上, Middleware 和 Handler 都是處理 Request 請求，並且可能向 Response 寫入數據.而 Handler 接收的參數是 Request, Depot, Response 三個, 其中 Depot 用於存儲請求處理過程中的臨時數據. 爲方便書寫, 在用不着的情況下可以省略掉某些參數.

```rust
use salvo::prelude::*;

#[handler]
async fn hello_world(_req: &mut Request, _depot: &mut Depot, res: &mut Response) {
    res.render("Hello world");
}
#[handler]
async fn hello_world(res: &mut Response) {
    res.render("Hello world");
}
```

另外路由系統提供的 API 也是極其簡單的, 但是, 功能卻是強大的. 正常使用需求下, 基本上就是隻關注 Router 一個類型即可.

## 路由系統

我自己感覺路由系統是跟其他的框架不太一樣的. Router 可以寫平，也可以寫成樹狀.這裏區業務邏輯樹與訪問目錄樹.業務邏輯樹是根據業務邏輯需求，劃分 router 結構，形成 router 樹，它不一定與訪問目錄樹一致.

正常情況下我們是這樣寫路由的：

```rust
Router::new().path("articles").get(list_articles).post(create_article);
Router::new()
    .path("articles/<id>")
    .get(show_article)
    .patch(edit_article)
    .delete(delete_article);
```

往往查看文章和文章列表是不需要用戶登錄的, 但是創建, 編輯, 刪除文章等需要用戶登錄認證權限纔可以. Salvo 中支持嵌套的路由系統可以很好地滿足這種需求. 我們可以把不需要用戶登錄的路由寫到一起：

```rust
Router::new()
    .path("articles")
    .get(list_articles)
    .push(Router::new().path("<id>").get(show_article));
```

然後把需要用戶登錄的路由寫到一起， 並且使用相應的中間件驗證用戶是否登錄：
```rust
Router::new()
    .path("articles")
    .hoop(auth_check)
    .post(list_articles)
    .push(Router::new().path("<id>").patch(edit_article).delete(delete_article));
```

雖然這兩個路由都有這同樣的 ```path("articles")```, 然而它們依然可以被同時添加到同一個父路由, 所以最後的路由長成了這個樣子:

```rust
Router::new()
    .push(
        Router::new()
            .path("articles")
            .get(list_articles)
            .push(Router::new().path("<id>").get(show_article)),
    )
    .push(
        Router::new()
            .path("articles")
            .hoop(auth_check)
            .post(list_articles)
            .push(Router::new().path("<id>").patch(edit_article).delete(delete_article)),
    );
```

```<id>```匹配了路徑中的一個片段, 正常情況下文章的 ```id``` 只是一個數字, 這是我們可以使用正則表達式限制 ```id``` 的匹配規則, ```r"<id:/\d+/>"```.