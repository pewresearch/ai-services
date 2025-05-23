/**
 * External dependencies
 */
import { store as pluginSettingsStore } from '@ai-services/settings';

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Renders a utility component to conditionally trigger the browser warning about unsaved changes.
 *
 * @since 0.1.0
 *
 * @returns The component to be rendered.
 */
export default function UnsavedChangesWarning() {
	const isDirty = useSelect( ( select ) => {
		const { hasModifiedSettings } = select( pluginSettingsStore );

		return hasModifiedSettings();
	}, [] );

	useEffect( () => {
		const warnIfUnsavedChanges = ( event: BeforeUnloadEvent ) => {
			if ( isDirty ) {
				event.returnValue = __(
					'You have unsaved changes. If you proceed, they will be lost.',
					'ai-services'
				);
				return event.returnValue;
			}
		};

		window.addEventListener( 'beforeunload', warnIfUnsavedChanges );
		return () => {
			window.removeEventListener( 'beforeunload', warnIfUnsavedChanges );
		};
	}, [ isDirty ] );

	return null;
}
