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
        '/api/get'     => 'getPosts',
        '/api/find'    => 'findPost',
        '/api/search'  => 'searchPosts',
        '/api/js_api'  => 'generate_JS_DOC',
        '/auth/login'  => 'login',
        '/auth/logout' => 'logout',
        '/auth/template' => 'auth_template',
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
     * Prints template if logged in.
     * @return String Template.
     */
    private static function auth_template()
    {
        if(User::loggedIn()) {
            $path =  getcwd() . '\html\templates' . $_GET['path'];
            $shll = fopen($path, "r") or die("Unable to open file!");
            // Read content
            $content = fread($shll, filesize($path));
            print $content;
        } else {
            print '<h1>Login Required</h1>';
            print '<p>This page requires login.</p>';
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

    /**
     * Reads shll.js and echoes api based on documentation.
     * @return [type] [description]
     */
    private static function generate_JS_DOC()
    {
        $path = getcwd() . "\js\shll.js";

        // Open file
        $shll = fopen($path, "r") or die("Unable to open file!");
        // Read content
        $content = fread($shll, filesize($path));
        // Only get api part
        $start   = strpos($content, 'var shll = {');
        $content = substr($content, $start);
        // Turn into array
        $pieces = explode('/**', $content);
        // Loop array
        foreach ($pieces as $piece) {
            if ($piece != '' && trim($piece) != 'var shll = {' && !strpos($piece, 'var create =')) {
                $start = strpos($piece, ': function(');
                $piece = substr($piece, 0, $start);
                $piece = trim($piece);

                // Extract parts
                $name = trim(substr($piece, strpos($piece, '*/') + 2));
                $info = explode('*', substr($piece, 0, strpos($piece, '*/')));
                unset($info[0]);
                $description = array_shift($info);

                echo '<div class="api_function">';
                echo '<code>.' . $name . '</code>';
                echo '<p class="description">' . $description . '</p>';
                echo '<table>';
                foreach ($info as $line) {
                    echo '<tr>';
                    if ($line != '') {
                        if (strpos($line, '@param')) {
                            $line = substr($line, 7);
                            $type = substr($line, strpos($line, '{') + 1, strpos($line, '}') - 3);
                            $line = substr($line, strpos($line, '}') + 1);
                            $rest = explode(' ', trim($line), 2);
                            $name = trim(array_shift($rest));
                            $desc = trim(array_shift($rest));

                            echo '<td><b>' . $type . '</b></td>';
                            echo '<td><i>' . $name . '</i></td>';
                            echo '<td>' . $desc . '</td>';
                        } else if (strpos($line, '@return')) {
                            $line = substr($line, 7);
                            $type = substr($line, strpos($line, '{') + 1, strpos($line, '}') - 3);
                            $desc = substr($line, strpos($line, '}') + 1);

                            echo '<td><b>return</b></td>';
                            echo '<td><i>' . $type . '</i></td>';
                            echo '<td>' . $desc . '</td>';
                        }
                    }
                    echo '</tr>';
                }
                echo '</table>';
                echo '</div>';
            } else if (trim($piece) == 'var shll = {') {
                echo '<h3>shll</h3>';
            } else if (strpos($piece, 'var create =')) {
                echo '<h3>create</h3>';
            }
        }

        fclose($shll);
    }
}
