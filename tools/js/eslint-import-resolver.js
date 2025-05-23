/**
 * External dependencies
 */
const resolverNode = require( 'eslint-import-resolver-node' );
const path = require( 'path' );

const PACKAGES_DIR = path.resolve( __dirname, '../../src' );

exports.interfaceVersion = 2;

exports.resolve = ( source, file, config ) => {
	const resolve = ( sourcePath ) =>
		resolverNode.resolve( sourcePath, file, {
			...config,
			extensions: [ '.tsx', '.ts', '.mjs', '.js', '.json', '.node' ],
		} );

	if ( source.startsWith( '@ai-services/' ) ) {
		const packageName = source.slice( '@ai-services/'.length );

		return resolve( path.join( PACKAGES_DIR, packageName ) );
	}

	return resolve( source );
};
