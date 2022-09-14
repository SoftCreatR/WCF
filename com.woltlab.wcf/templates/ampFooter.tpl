		</main>
		
		<amp-sidebar id="sidebar" layout="nodisplay">
			<button type="button" on="tap:sidebar.close">{lang}wcf.global.button.close{/lang}</button>
			
			<h3>{lang}wcf.menu.page.navigation{/lang}</h3>
			<ol>
				{foreach from=$__wcf->getBoxHandler()->getBoxByIdentifier('com.woltlab.wcf.MainMenu')->getMenu()->getMenuItemNodeList() item=menuItemNode}
					{if $menuItemNode->getDepth() == 1 || $menuItemNode->getParentNode()->isActiveNode()}
					<li>
						<a href="{$menuItemNode->getURL()}">{$menuItemNode->getTitle()}</a>
					
						{if $menuItemNode->hasChildren() && $menuItemNode->isActiveNode()}<ol>{else}</li>{/if}
						
						{if !$menuItemNode->hasChildren() && $menuItemNode->isLastSibling()}
							{@"</ol></li>"|str_repeat:$menuItemNode->getOpenParentNodes()}
						{/if}
					{/if}
				{/foreach}
			</ol>
			{if $__wcf->getBoxHandler()->getBoxByIdentifier('com.woltlab.wcf.FooterMenu')}
				{hascontent}
					<ol>
						{content}	
							{foreach from=$__wcf->getBoxHandler()->getBoxByIdentifier('com.woltlab.wcf.FooterMenu')->getMenu()->getMenuItemNodeList() item=menuItemNode}
		                                                {if $menuItemNode->getDepth() == 1 || $menuItemNode->getParentNode()->isActiveNode()}
								<li>
									<a href="{$menuItemNode->getURL()}">{$menuItemNode->getTitle()}</a>
		
									{if $menuItemNode->hasChildren() && $menuItemNode->isActiveNode()}<ol>{else}</li>{/if}
		
		                                                        {if !$menuItemNode->hasChildren() && $menuItemNode->isLastSibling()}
		                                                                {@"</ol></li>"|str_repeat:$menuItemNode->getOpenParentNodes()}
		                                                        {/if}
		                                                {/if}
							{/foreach}
						{/content}
					</ol>
				{/hascontent}
			{/if}
			<h3>{lang}wcf.menu.page.location{/lang}</h3>
			<ol class="breadcrumbs">
				{assign var=__breadcrumbsDepth value=0}
				{foreach from=$__wcf->getBreadcrumbs() item=$breadcrumb}
					{* skip breadcrumbs that do not expose a visible label *}
					{if $breadcrumb->getLabel()}
						<li><a href="{$breadcrumb->getURL()}">{$breadcrumb->getLabel()}</a></li>
						{assign var=__breadcrumbsDepth value=$__breadcrumbsDepth + 1}
					{/if}
				{/foreach}
			</ol>
		</amp-sidebar>
		
		{if MODULE_COOKIE_POLICY_PAGE && !$__wcf->user->userID}
			<amp-user-notification layout="nodisplay" id="cookie-policy-notice">
				{lang}wcf.page.cookiePolicy.info{/lang}
				<button type="button" on="tap:cookie-policy-notice.dismiss">{lang}wcf.global.button.close{/lang}</button>
			</amp-user-notification>
		{/if}
		
		<footer class="footer">
			<div class="copyright">{lang}wcf.page.copyright{/lang}</div>
		</footer>
	</body>
</html>
