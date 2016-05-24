<?php

class DB
{
    /**
     * Echoes out result of prepared query as JSON.
     * @param  string $sql    sql query to be executed.
     * @param  string $types  types of the parameters, iii, s, is, si, etc.
     * @param  array $params parameters for the prepared query.
     */
    public static function respond($sql, $types, $params)
    {
        $result = self::query($sql, $types, $params);
        self::echoJSON($result);
    }

    /**
     * Executes prepared sql statement and returns result.
     * @param  string $sql    sql query to be executed.
     * @param  string $types  types of the parameters, iii, s, is, si, etc.
     * @param  array $params parameters for the prepared query.
     */
    public static function query($sql, $types, $params)
    {
        $mysqli = self::getConnection();
        $stmt   = $mysqli->stmt_init();

        $a_params = array();

        /* with call_user_func_array, array params must be passed by reference */
        $a_params[] = &$types;

        $n = count($params);
        for ($i = 0; $i < $n; $i++) {
            /* with call_user_func_array, array params must be passed by reference */
            $a_params[] = &$params[$i];
        }

        $stmt = $mysqli->prepare($sql);
        if ($stmt === false) {
            trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $mysqli->errno . ' ' . $mysqli->error, E_USER_ERROR);
        }

        /* use call_user_func_array, as $stmt->bind_param('s', $param); does not accept params array */
        call_user_func_array(array($stmt, 'bind_param'), $a_params);

        $stmt->execute();

        $result = $stmt->get_result();

        $stmt->close();
        $mysqli->close();

        return $result;
    }

    /**
     * Executes normal sql
     * @param  string $sql    sql query to be executed.
     */
    public static function execute($sql)
    {
        $mysqli = self::getConnection();
        return $mysqli->query($sql);
    }

    /**
     * Echoes out json encoded result from prepared statement
     * @param  string $sql sql to be executed
     */
    public static function echoJSON($result)
    {
        $response = [];
        while ($row = $result->fetch_object()) {
            $object = [];
            foreach ($row as $col => $value) {
                $object[$col] = utf8_encode($value);
            }
            $response[] = $object;
        }

        echo json_encode($response);
    }

    /**
     * Returns connection to database
     * @return mysqli connection to the database
     */
    public static function getConnection()
    {
        $mysqli = new \mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

        if ($mysqli->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } else {
            return $mysqli;
        }
    }
}
