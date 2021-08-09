import { CfnWebACL } from '@aws-cdk/aws-wafv2';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { StackProps, App, Stack } from '@aws-cdk/core';

export class WAFStack extends Stack {
    constructor(scope: App, id: string, props: StackProps) {
        super(scope, id, props);

        const waf = new CfnWebACL(this, "FrontendWAF", {
            defaultAction: {
                allow: {},
            },
            scope: "CLOUDFRONT",
            visibilityConfig: {
                cloudWatchMetricsEnabled: false,
                metricName: "waf",
                sampledRequestsEnabled: false,
            },
            rules: [
                {
                    name: 'AWS-AWSManagedRulesCommonRuleSet',
                    priority: 10,
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesCommonRuleSet',
                        },
                    },
                    overrideAction: {
                        none: {
                        },
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: false,
                        cloudWatchMetricsEnabled: false,
                        metricName: 'AWS-AWSManagedRulesCommonRuleSet',
                    },
                },
            ],
        });

        const wafAclArnSsmParamKey = "/acl/arn"

        new StringParameter(this, 'WafArnSSMParam', {
            parameterName: wafAclArnSsmParamKey,
            description: 'The WAF instance in us-east-1',
            stringValue: waf.attrArn
        });
    }
}
const app = new App();

new WAFStack(app, 'stack-with-waf', {});

app.synth();
