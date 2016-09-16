<html>
    <head>
        <base href="<?php echo DOC_ROOT ?>/">

        <meta charset="UTF-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        <meta name="server_name" content="<?php echo $_SERVER['SERVER_NAME'] ?>" />
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
        <link rel="icon" type="image/png" href="css/res/icons/Icon_16.ico">

        <!-- css <link href="css/style.min.css" rel="stylesheet" type="text/css" /> -->
        <link rel="dns-prefetch" href="//fonts.googleapis.com/">
        <link href="https://fonts.googleapis.com/css?family=Asap:700i|PT+Serif:400i,400,700,700i" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet" type="text/css" />

        <!-- js <script src="js/app.min.js"></script> -->
        <script src="js/polyfill.js"></script>
        <script src="js/shll.js"></script>
        <script src="js/main.js"></script>

        <!-- handle js disabled -->
        <noscript>
            <META HTTP-EQUIV="Refresh" CONTENT="0;URL=<?php echo DOC_ROOT ?>/html/errors/js_disabled.html">
        </noscript>

        <style type="text/css">
            .vertical-line {
                height: 100%;
                width: 32px;
            }
            .vertical-line {
                border-left: 1px solid cyan;
            }
            .vertical-line:last-child {
                border-right: 1px solid cyan;
            }
            .horizontal-line {
                height: 32px;
                width: 100%;
            }
            .horizontal-line {
                border-bottom: 1px solid cyan;
            }
        </style>
    </head>

    <body style="position:relative;">
        <nav>
            <div class="nav_links">
                <a id="home"  href="/">shll</a>
                <a id="blogg" href="/blogg">Blogg</a>
                <?php echo User::loggedIn() ? '<a id="admin" href="/admin">Admin</a>' : ''; ?> 
            </div>
        </nav>

        <div class="wrap">
            <div id="content"></div>
        </div>

        <div id="vertical-lines" style="display: none; display: none; position: absolute; height: 100%; width: 100%; margin: 0 auto; left: 50%; top: 0; z-index: -1; max-width: 768px;">
            <div style="position: relative; left: -50%; " class="layout">
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>     
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>   
                <div class="vertical-line"></div>  
            </div>
        </div>
        <div id="horizontal-lines"  style="display: none; display: none; position: absolute; height: 100%; width: 100%; margin: 0 auto; left: 50%; top: 0; z-index: -1; max-width: 768px;">
            <div style="position: relative; left: -50%; " class="layout">
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>     
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div> 
                <div class="horizontal-line"></div>     
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>  
                <div class="horizontal-line"></div>     
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>   
                <div class="horizontal-line"></div>    
            </div>
        </div>
    </body>
</html>
