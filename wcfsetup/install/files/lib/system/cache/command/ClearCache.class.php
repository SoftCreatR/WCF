<?php

namespace wcf\system\cache\command;

use wcf\data\package\update\server\PackageUpdateServer;
use wcf\system\cache\CacheHandler;
use wcf\system\cache\event\CacheCleared;
use wcf\system\event\EventHandler;
use wcf\system\language\LanguageFactory;
use wcf\system\style\StyleHandler;

/**
 * Performs a full cache clear.
 *
 * @author  Tim Duesterhus
 * @copyright   2001-2021 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\System\Cache\Event
 * @since   6.0
 */
final class ClearCache
{
    private EventHandler $eventHandler;

    public function __construct()
    {
        $this->eventHandler = EventHandler::getInstance();
    }

    public function __invoke()
    {
        // reset stylesheets
        StyleHandler::resetStylesheets();

        // delete language cache and compiled templates as well
        LanguageFactory::getInstance()->deleteLanguageCache();

        // get package dirs
        CacheHandler::getInstance()->flushAll();

        // reset package update servers and the package cache
        PackageUpdateServer::resetAll();

        $this->eventHandler->fire(
            new CacheCleared()
        );
    }
}