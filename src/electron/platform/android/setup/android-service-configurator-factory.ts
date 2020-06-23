// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper, AdbWrapperFactory } from 'electron/platform/android/adb-wrapper';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    PortFinder,
} from 'electron/platform/android/setup/android-service-configurator';

export class AndroidServiceConfiguratorFactory {
    constructor(
        private readonly adbWrapperFactory: AdbWrapperFactory,
        private readonly apkLocator: AndroidServiceApkLocator,
        private readonly portFinder: PortFinder,
    ) {}

    public getServiceConfigurator = async (
        adbLocation: string,
    ): Promise<AndroidServiceConfigurator> => {
        const adbWrapper: AdbWrapper = await this.adbWrapperFactory.createValidatedAdbWrapper(
            adbLocation,
        );
        return new AndroidServiceConfigurator(adbWrapper, this.apkLocator, this.portFinder);
    };
}
