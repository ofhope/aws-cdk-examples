# Basic WAF

> A web access control list (web ACL) gives you fine-grained control over the web requests that your protected resource responds to. You can protect Amazon CloudFront, Amazon API Gateway, Application Load Balancer, and AWS AppSync resources.

> Associates a Web ACL with a regional application resource, to protect the resource. A regional application can be an Application Load Balancer (ALB), an API Gateway REST API, or an AppSync GraphQL API.

Using SSM Agent we can associate a resource with our cloudfront distribution (or load balancer or gateway). In this case [StringParameter](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ssm.StringParameter.html) from the ssm module is used to make the association to [CfnWebACL](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-waf.CfnWebACL.html).

CfnWebACL is created with a global `CLOUDFRONT` scope. You can use `scope: "REGIONAL"` and bind it to a load blancer with

```js
new wafv2.CfnWebACLAssociation(this, BaseStack.resourceName("CmsWAFAssociation"), {
  resourceArn: loadblancer.loadBalancerArn,
  webAclArn: waf.attrArn
});
```

This example is using [AWSManagedRulesCommonRuleSet](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html) from the AWS managed rule sets.

There is an [issue](https://github.com/aws/aws-cdk/issues/6056#issuecomment-605985998) using rulesets where you must include an empty overide object even if you don't want to override.

```js
overrideAction: {
    none: {
    },
},
```
