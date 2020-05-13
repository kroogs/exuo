/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import React from 'react'
import { Link } from '@reach/router'

export const Settings: React.FunctionComponent = () => (
  <>
    <Link to="/">Root</Link>
    <Link to="/settings">Settings</Link>
  </>
)

export default Settings
