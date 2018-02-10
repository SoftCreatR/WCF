<?php
declare(strict_types=1);
namespace wcf\data\user\menu\item;
use wcf\data\DatabaseObjectList;

/**
 * Represents a list of user menu items.
 * 
 * @author	Alexander Ebert
 * @copyright	2001-2017 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\Data\User\Menu\Item
 *
 * @method	UserMenuItem		current()
 * @method	UserMenuItem[]		getObjects()
 * @method	UserMenuItem|null	search($objectID)
 * @property	UserMenuItem[]		$objects
 */
class UserMenuItemList extends DatabaseObjectList { }
