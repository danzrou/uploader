import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { CONFIG } from './app/config/config';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

fetch('assets/config.json')
	.then(config => config.json())
	.then(config => {
		const configProvider = {
			provide: CONFIG,
			useValue: config
		};

		platformBrowserDynamic([configProvider])
			.bootstrapModule(AppModule)
			.catch(err => console.error(err));
	});
