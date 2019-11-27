#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { CreateVmStack } from '../lib/create_vm-stack';

const app = new cdk.App();
new CreateVmStack(app, 'CreateVmStack');