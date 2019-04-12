const
  path              = require('path'),
  manifest          = require('../manifest'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

const titles = {
  'index': 'Dashboard',
  'sidebar_lite': 'Sidebar Lite',
  'sidebar_premium': 'Sidebar Premium',
  'nav': 'Nav',
  'regulation_schema': 'Regulation Schema',
  'policy_schema': 'Policy Schema',
  'mapping_schema': 'Mapping Schema',
  'regulation_research': 'Regulation Research',
  'analyze': 'Analyze',
  'regulation_mapping_schema': 'Regulation Mapping Schema',
  'policy_mapping_schema': 'Policy Mapping Schema',
  'analyze_reg_mapping': 'Analyze Regulation Mapping',
  'analyze_policy_mapping': 'Analyze Policy Mapping'
};

module.exports = Object.keys(titles).map(title => {
  return new HtmlWebpackPlugin({
    template: path.join(manifest.paths.src, `${title}.html`),
    path: manifest.paths.build,
    filename: `${title}.html`,
    inject: true,
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true,
    },
  });
});
