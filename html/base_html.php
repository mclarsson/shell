<html>
    <head>
        <base href="<?php echo DOC_ROOT ?>/">

        <meta charset="UTF-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <meta name="doc_root" content="<?php echo DOC_ROOT ?>" />
        <meta name="csrf_token" content="<?php echo User::loggedIn() ? $_SESSION['csrf_token'] : ''; ?>" />

        <meta name="application-name" content="Application Name">
        <meta name="description" content="150 chars">
        <meta name="subject" content="your website's subject">
        <meta name="robots" content="index,follow,noodp">
        <meta name="googlebot" content="index,follow">
        <meta name="google" content="nositelinkssearchbox">
        <meta name="google-site-verification" content="verification_token">
        <meta name="abstract" content="">
        <meta name="topic" content="">
        <meta name="summary" content="">
        <meta name="classification" content="business">
        <meta name="url" content="https://example.com/">
        <meta name="identifier-URL" content="https://example.com/">
        <meta name="directory" content="submission">
        <meta name="category" content="">
        <meta name="coverage" content="Worldwide">
        <meta name="distribution" content="Global">
        <meta name="rating" content="General">
        <meta name="referrer" content="never">

        <title>shll</title>

        <!-- css -->
        <link rel="dns-prefetch" href="//fonts.googleapis.com/">
        <link href="https://fonts.googleapis.com/css?family=Asap:700|Roboto+Mono|PT+Serif" rel="stylesheet">
        <link href="css/app.css" rel="stylesheet" type="text/css" />

        <!-- js -->
        <script src="js/shll.js"></script>
        <script src="js/main.js"></script>

        <!-- handle js disabled -->
        <noscript>
            <META HTTP-EQUIV="Refresh" CONTENT="0;URL=<?php echo DOC_ROOT ?>/html/errors/js_disabled.html">
        </noscript>
    </head>

    <body>
        <nav>
            <a href="/">Martin</a>
            <a href="/blogg">Blogg</a>
            <?php /* echo User::loggedIn() ? '<a target="_self" href="auth/logout">Log out</a>' : '<a href="/login">Login</a>'; */?>
        </nav>

        <style>
            .grid {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
            }

            .grid-holder {
                max-width: 64rem;
                margin: 0 auto;
                position: relative;
            }

            .vertical,
            .horizontal,
            .columns {
                position: absolute;
                width: 100%;
                height: 100vh;
            }

            .grid .horizontal .line {
                width: 100%;
                height: 4rem;
                border-bottom: 1px solid cyan;
            }

            .grid .vertical .line {
                height: 100%;
                width: 4rem;
                float: left;
                border-left: 1px solid cyan;
            }

            .grid .vertical .line:last-child {
                border-right: 1px solid cyan;
            }

            .grid .columns .col {
                width: 16rem;
                height: 100%;
                border-left: 1px solid pink;
            }

            .grid .columns .col:last-child {
                border-right: 1px solid pink;
            }

        </style>

        <div class="grid">
            <div class="grid-holder">
                <div class="vertical">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>

                <div class="horizontal">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>

                <div class="columns">
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col"></div>
                </div>
            </div>
        </div>

        <div id="content"></div>
    </body>
</html>
