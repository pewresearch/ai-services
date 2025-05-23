/**
 * Internal dependencies
 */
import GenerativeAiService from './generative-ai-service';
import GenerativeAiModel from './generative-ai-model';
import BrowserGenerativeAiModel from './browser-generative-ai-model';
import { findModel } from '../util';
import type { ModelParams } from '../types';

const EMPTY_OBJECT = {};

/**
 * Special service class only used for the 'browser' service.
 *
 * @since 0.1.0
 */
export default class BrowserGenerativeAiService extends GenerativeAiService {
	/**
	 * Gets a generative model instance from the service.
	 *
	 * @since 0.3.0
	 *
	 * @param modelParams - Model parameters. At a minimum this must include the unique "feature" identifier.
	 * @returns Generative AI model instance.
	 */
	getModel( modelParams: ModelParams ): GenerativeAiModel {
		modelParams = modelParams || EMPTY_OBJECT;

		const model = findModel( this.models, modelParams );

		return new BrowserGenerativeAiModel(
			{
				serviceSlug: this.metadata.slug,
				metadata: { ...model },
			},
			modelParams
		);
	}
}
