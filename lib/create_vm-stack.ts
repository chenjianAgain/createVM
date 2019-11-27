import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import autoscaling = require('@aws-cdk/aws-autoscaling'); 

export class CreateVmStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Using default vpc
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true
    });

    // Open port 22 for SSH connection from anywhere
    const mySecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      securityGroupName: "my-test-sg",
      description: 'Allow ssh access to ec2 instances from anywhere',
      allowAllOutbound: true 
    });
    mySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic(), 'allow public ssh access')


    // We are using the latest AMAZON LINUX AMI
    const awsAMI = new ec2.AmazonLinuxImage({generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2});
    // const linuxAMI = new ec2.GenericLinuxImage()
    
    const masterAsg = new autoscaling.AutoScalingGroup(this, 'masterAsg', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: awsAMI,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      associatePublicIpAddress: true,
      allowAllOutbound: true,
      keyName: 'key'
    }).addSecurityGroup(mySecurityGroup);
  }
}
