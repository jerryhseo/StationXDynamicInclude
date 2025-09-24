const SXSystem ={
	loadStartPortletModuleScript: (srcUrl)=>{
		const oldScript = document.querySelector(`script[src^="${srcUrl}"]`);
		if (oldScript){
			console.log("Old script removed...");
			oldScript.remove();
		}
		
		const newScript = document.createElement('script');
		newScript.type = 'module';
		newScript.src = `${srcUrl}?v=${Date.now()}`; // cache-busting
		document.head.appendChild(newScript);
	},
	getUser: function(){
		return {
				userId: Liferay.ThemeDisplay.getUserId(),
				userName: Liferay.ThemeDisplay.getUserName().replace(/\\u([\d\w]{4})/gi, (match, grp) => {
					return String.fromCharCode(parseInt(grp, 16));
				})
		};
	},
	getLanguageId: function(){
			return Liferay.ThemeDisplay.getLanguageId().replace(/_/g, "-");
	},
	getDefaultLanguageId: function(){
			return Liferay.ThemeDisplay.getDefaultLanguageId().replace(/_/g, "-");
	},
	getAvailableLanguages: function(){
		return Object.keys(Liferay.Language.available).map(lang=>lang.replace(/_/g, "-"));
	}
};