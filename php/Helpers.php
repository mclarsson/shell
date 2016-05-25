<?php

/**
 * Redirects user to path.
 * @param  string $to Url to direct to.
 */
function redirect($to)
{
    if ($to == '/' && DOC_ROOT == '') {
        $location = '/';
    } else {
        $location = DOC_ROOT . $to;
    }
    header('Location: ' . $location);
}
