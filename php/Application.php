<?php

/**
 * Class handling the API
 */
class Application
{

    /**
     * Calls function associated with route, returns base html otherwise
     */
    public static function route($uri)
    {
        $trimmed = substr($uri, strlen(DOC_ROOT));
        if (array_key_exists($trimmed, self::$routes)) {
            self::{self::$routes[$trimmed]}();
        } else {
            include BASE_HTML;
        }
    }

    ///////////
    // _API_ //
    ///////////

    // Routes handled by php, these will not be available to angular.
    private static $routes = [
        '/api/get'       => 'getPosts',
        '/api/template'  => 'renderTemplate',
        '/api/find'      => 'findPost',
        '/api/search'    => 'searchPosts',
        '/auth/login'    => 'login',
        '/auth/logout'   => 'logout',
        '/auth/register' => 'register',
        '/auth/template' => 'auth_template'
    ];

    /**
     * Logs user in
     */
    private static function login()
    {
        if (empty($_POST['username']) || empty($_POST['password'])) {
            redirect('/login');
        } else {
            $username = $_POST['username'];
            $password = $_POST['password'];
            $user     = DB::query("SELECT * FROM users WHERE username = ?", 's', [$username])->fetch_object();
            User::login($user, $username, $password);
            redirect('/');
        }
    }

    /**
     * Logs user out
     */
    private static function logout()
    {
        User::logout();
        redirect('/');
        exit();
    }

    /**
     * Prints template if path does not contain auth.
     * @return String Template.
     */
    private static function renderTemplate()
    {
        if (strpos($_GET['path'], 'auth') === false) {
            $path = ltrim($_GET['path'], '/');
            $file = fopen($path, "r") or die("Unable to open file!");
            // Read content
            $content = fread($file, filesize($path));
            print $content;
        } else {
            self::auth_template();
        }
    }

    /**
     * Prints template if logged in.
     * @return String Template.
     */
    private static function auth_template()
    {
        if (User::loggedIn()) {
            $path = ltrim($_GET['path'], '/');
            $file = fopen($path, "r") or die("Unable to open file!");
            // Read content
            $content = fread($file, filesize($path));
            print $content;
        } else {
            print '<h1>Login Required</h1>';
            print '<p>This page requires <a href="login">login</a>.</p>';
        }
    }

    /**
     * Register new user
     *
     */
    private static function register()
    {
        if (User::confirm_csrf($_POST['csrf_token'])) {
            $username = $_POST['username'];
            $password = $_POST['password'];
            if ($username != '' && $password != '') {
                User::create($username, $password);
                message('Admin created', 'success');
            } else {
                message('Username or password not set', 'error');
            }
        } else {
            message('CSRF tokens doesn\'t match', 'error');
        }
    }

    /**
     * Returns a set amount of the most recent posts.
     */
    private static function getPosts()
    {
        $from = isset($_GET['from']) ? $_GET['from'] : 0;
        $to   = isset($_GET['to']) ? $_GET['to'] : 30;
        $sql  = "SELECT * FROM posts ORDER BY id DESC LIMIT ?, ?";

        DB::respond($sql, 'ii', [$from, $to]);
    }

    /**
     * Finds posts with matching title.
     */
    private static function findPost()
    {
        $title = isset($_GET['title']) ? urldecode($_GET['title']) : '';
        $id    = isset($_GET['id']) ? $_GET['id'] : -1;
        $sql   = "SELECT * FROM posts WHERE title = ? OR id = ?";
        DB::respond($sql, 'si', [$title, $id]);
    }
}
