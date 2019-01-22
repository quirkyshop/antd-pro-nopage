import React, { Fragment } from 'react';
import { connect } from 'dva';
import Form, { FormItem, Item, FormCore, If } from 'noform';
import { Input, Button, Select } from 'nowrapper/lib/antd';
import { Divider, Alert } from 'antd';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = { label: 5, control: 19 };

@connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))
class Step extends React.PureComponent {
  constructor(props) {
    super(props);

    const { route } = props;
    const { name } = route;
    this.isConfirm = name === 'confirm';
    this.core = new FormCore({
      globalStatus: this.isConfirm ? 'preview' : 'edit',
      autoValidate: true,
      values: props.data,
      validateConfig: {
        payAccount: [{ required: true, message: '请选择付款账户' }],
        receiverAccount: [
          { required: true, message: '请输入收款人账户' },
          { type: 'email', message: '账户名应为邮箱格式' },
        ],
        receiverName: [{ required: true, message: '请输入收款人姓名' }],
        amount: [
          { required: true, message: '请输入转账金额' },
          {
            pattern: /^(\d+)((?:\.\d+)?)$/,
            message: '请输入合法金额数字',
          },
        ],
        password: [{ required: true, message: '需要支付密码才能进行支付' }]
      }
    });
  }

  render() {
    const { dispatch, submitting } = this.props;
    const onValidateForm = async() => {
      const err = await this.core.validate();
      const values = this.core.getValues();
      if (!err) {
        if (this.isConfirm) { // 确认步骤进行提交
          dispatch({
            type: 'form/submitStepForm',
            payload: values,
          });
        } else { // 新建步骤机型保存
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          router.push('/form/step-form/confirm');
        }
      }
    };
    const onPrev = () => {
      router.push('/form/step-form/info');
    };

    return (
      <Fragment>
        <Form core={this.core} layout={formItemLayout} className={styles.stepForm}>
          {/* 确认步骤展示确认信息 */}
          <If when={() => this.isConfirm}>
            <Alert
              closable
              showIcon
              message="确认转账后，资金将直接打入对方账户，无法退回。"
              style={{ marginBottom: 24 }}
            />
          </If>

          <FormItem label="付款账户" name="payAccount">
            <Select placeholder="test@example.com">
              <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
            </Select>
          </FormItem>
          <FormItem label="收款账户">
            <Input.Group compact>
              <Item name="receiverAccountType" defaultValue="alipay">
                <Select style={{ width: 100 }}>
                  <Option value="alipay">支付宝</Option>
                  <Option value="bank">银行账户</Option>
                </Select>
              </Item>
              <Item name="receiverAccount">
                <Input style={{ width: 'calc(100% - 100px)' }} placeholder="test@example.com" />
              </Item>
            </Input.Group>
          </FormItem>
          <FormItem label="收款人姓名" name="receiverName">
            <Input placeholder="请输入收款人姓名" />
          </FormItem>
          <FormItem label="转账金额" name="amount">
            <Input prefix="￥" placeholder="请输入金额" />
          </FormItem>

          {/* 新建步骤展示下一步 */}
          <If when={() => !this.isConfirm}>
            <FormItem label="">
              <Button type="primary" onClick={onValidateForm}>下一步</Button>
            </FormItem>
          </If>
          <Divider style={{ margin: '40px 0 24px' }} />

          {/* 确认步骤展示提交 */}
          <If when={() => this.isConfirm}>
            <div>
              <FormItem label="支付密码" status="edit" required={false} name="password" defaultValue="123456">
                <Input type="password" autoComplete="off" style={{ width: '80%' }} />
              </FormItem>
              <FormItem label="">
                <div>
                  <Button type="primary" onClick={onValidateForm} loading={submitting}>
                    提交
                  </Button>
                  <Button onClick={onPrev} style={{ marginLeft: 8 }}>
                    上一步
                  </Button>
                </div>
              </FormItem>
            </div>
          </If>       

          {/* 新建步骤展示说明事项 */}
          <If when={() => !this.isConfirm}>
            <div className={styles.desc}>
              <h3>说明</h3>
              <h4>转账到支付宝账户</h4>
              <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
              </p>
              <h4>转账到银行卡</h4>
              <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
              </p>
            </div>
          </If>
        </Form>
      </Fragment>
    );
  }
}

export default Step;
