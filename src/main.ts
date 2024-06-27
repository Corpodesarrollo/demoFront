import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'

const elementPlusLocale = await import ('element-plus/es/locale/lang/es');

/*switch ((<any>window).GetLocale())
{
	// en
	default: elementPlusLocale = await import ('element-plus/es/locale/lang/es'); break;
	case 'es': elementPlusLocale = await import ('element-plus/es/locale/lang/en'); break;
}
*/

(<any>window).SetAxiosSettings (axios);

createApp(App).use(router).use(ElementPlus, {locale: elementPlusLocale.default}).mount('#app')
