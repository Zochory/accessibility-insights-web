// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getNarrowModeThresholdsForUnified } from 'electron/common/narrow-mode-thresholds';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import { ResultsViewSelectors } from 'tests/electron/common/element-identifiers/results-view-selectors';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { ResultsViewController } from 'tests/electron/common/view-controllers/results-view-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/mock-adb/setup-mock-adb';

describe('NeedsReviewView', () => {
    let app: AppController;
    let resultsViewController: ResultsViewController;
    const windowWidth = getNarrowModeThresholdsForUnified().collapseHeaderAndNavThreshold + 5;
    const windowHeight = 1000;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );

        app = await createApplication({ suppressFirstTimeDialog: true });
        app.client.browserWindow.setSize(windowWidth, windowHeight);
        await app.setFeatureFlag(UnifiedFeatureFlags.leftNavBar, true);
        resultsViewController = await app.openResultsView();
        await resultsViewController.clickLeftNavItem('needs-review');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should use the expected window title', async () => {
        await app.waitForTitle('Accessibility Insights for Android - Needs review');
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });

    it('export report button does not exist', async () => {
        await resultsViewController.waitForSelectorToDisappear(
            ResultsViewSelectors.exportReportButton,
        );
    });
});
