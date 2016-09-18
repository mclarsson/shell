<?php

class User
{
    // blowfish
    private static $algo = '$52';
    // cost parameter
    private static $cost = '$ef';

    /**
     * Generated unique salt
     * @return string salt
     */
    private static function unique_salt()
    {
        return substr(sha1(mt_rand()), 0, 22);
    }

    /**
     * Generates a hashed string as password
     * @param  string $password raw input
     * @return string           hashed password
     */
    private static function hash($password)
    {
        return crypt($password, self::$algo . self::$cost . '$' . self::unique_salt());
    }

    /**
     * Compares hashed string to password
     * @param  string $hash     hashed input
     * @param  string $password stored password
     * @return boolean          input matches password
     */
    private static function check_password($hash, $password)
    {
        $full_salt = substr($hash, 0, 29);
        $new_hash  = crypt($password, $full_salt);
        return ($hash == $new_hash);
    }

    /**
     * Logs in user and sets session
     * @param  Object $user     user from database
     * @param  string $username username input
     * @param  string $password password input
     * @return boolean
     */
    public static function login($user, $username, $password)
    {
        if ($user) {
            if (self::check_password($user->password, $password)) {

                if (!isset($_SESSION)) {
                    session_start();
                }

                $_SESSION['id']         = $user->id;
                $_SESSION['username']   = $username;
                $_SESSION['csrf_token'] = base64_encode(openssl_random_pseudo_bytes(32));

                return true;
            }
        }
        return false;
    }

    /**
     * Logs out user
     * @return String
     */
    public static function logout()
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        if (isset($_SESSION['id'])) {
            unset($_SESSION['id']);
            unset($_SESSION['username']);
            $info = 'info';
            if (isset($_COOKIE[$info])) {
                setcookie($info, '', time() - $cookie_time);
            }
            $msg = "Logged Out Successfully...";
        } else {
            $msg = "Not logged in...";
        }
        return $msg;
    }

    /**
     * returns id and username from session
     * @return Array
     */
    public static function getCurrent()
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $sess = array();
        if (isset($_SESSION['id'])) {
            $sess["id"]       = $_SESSION['id'];
            $sess["username"] = $_SESSION['username'];
        }

        return $sess;
    }

    /**
     * checks token
     * @param  string $token csrf token
     * @return boolean tokens match
     */
    public static function confirm_csrf($token)
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        return $token == $_SESSION['csrf_token'];
    }

    /**
     * Determine if user is logged in
     * @return boolean current user session is set
     */
    public static function loggedIn()
    {
        return isset(self::getCurrent()['id']);
    }

    public static function create($username, $password)
    {
        $password = self::hash($password);
        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        DB::query($sql, 'ss', [$username, $password]);
    }
}
