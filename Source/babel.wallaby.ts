/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const wallabyBabelConfig = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          esmodules: "false",
          node: "current"
        }
       }
    ],
    "@babel/typescript"
  ],
  plugins: [
      "@babel/transform-modules-commonjs",
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread"
  ]
};
