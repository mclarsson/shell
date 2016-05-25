<html>
    <head>
        <base href="<?php echo DOC_ROOT ?>/">

        <meta charset="UTF-8">
        <title>BLOGG</title>
        <meta name="doc_root" content="<?php echo DOC_ROOT ?>" />
        <?php echo User::loggedIn() ? '<meta name="csrf_token" content="'. $_SESSION['csrf_token'] .'?>" />' : ''; ?>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <noscript>
            <META HTTP-EQUIV="Refresh" CONTENT="0;URL=<?php echo DOC_ROOT ?>/html/errors/js_disabled.html">
        </noscript>

        <!-- css -->
        <link href="css/app.css" rel="stylesheet" type="text/css" />

        <!-- js -->
        <script src="js/application.js"></script>
        <script src="js/main.js"></script>
    </head>

    <body>
        <nav>
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/about">About</a>
            <?php echo User::loggedIn() ? '<a target="_self" href="auth/logout">Log out</a>' : '<a href="/login">Login</a>'; ?>
        </nav>

        <div id="content"></div>
    </body>
</html>
