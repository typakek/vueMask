import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';


export default {
	input: 'src/index.js',
	plugins: [
		nodeResolve(),
		babel(),
	],
	output: [
		{
			format: 'umd',
			name: 'VueFastMask',
			exports: 'named',
			file: 'dist/vue-fast-mask.js',
		},
		{
			format: 'es',
			file: 'dist/vue-fast-mask.esm.js',
		},
	],
}