import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Form, { FormItem, FormCore, If } from 'noform';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Input, DatePicker, InputNumber, Radio, Button, Select } from 'nowrapper/lib/antd';
import { Card, Icon, Tooltip } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const core = new FormCore({
    autoValidate: true,
    validateConfig: {
        title: [{ required: true, message: formatMessage({ id: 'validation.title.required' }) }],
        date: [{ required: true, message: formatMessage({ id: 'validation.date.required' }) }],
        goal: [{ required: true, message: formatMessage({ id: 'validation.goal.required' }) }],
        standard: [{ required: true, message: formatMessage({ id: 'validation.standard.required' }) }],
    }
});

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
class BasicForms extends PureComponent {
  handleSubmit = async () => {
    const { dispatch } = this.props;
    const values = core.getValues();
    const err = await core.validate();
    if (!err) {
        dispatch({
            type: 'form/submitRegularForm',
            payload: values,
        });
    } else { // 自动滚动到第一个错误的位置
        core.scrollToError();
    }
  };

  render() {
    const { submitting } = this.props;
    const formItemLayout = {
        label: 7,
        control: 10
    };

    const submitLayout = {
        label: 7,
    };

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.forms.basic.title" />}
        content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Card bordered={false}>
          <Form direction="vertical-top" style={{ marginTop: 8 }} core={core} full>
            <FormItem layout={formItemLayout} name="title" label={<FormattedMessage id="form.title.label" />}>
              <Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />
            </FormItem>
            <FormItem layout={formItemLayout} name="date" label={<FormattedMessage id="form.date.label" />}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={[
                    formatMessage({ id: 'form.date.placeholder.start' }),
                    formatMessage({ id: 'form.date.placeholder.end' }),
                  ]}
              />
            </FormItem>
            <FormItem layout={formItemLayout} name="goal" label={<FormattedMessage id="form.goal.label" />}>
              <TextArea
                style={{ minHeight: 32 }}
                placeholder={formatMessage({ id: 'form.goal.placeholder' })}
                rows={4}
              />
            </FormItem>
            <FormItem layout={formItemLayout} name="standard" label={<FormattedMessage id="form.standard.label" />}>
              <TextArea
                style={{ minHeight: 32 }}
                placeholder={formatMessage({ id: 'form.standard.placeholder' })}
                rows={4}
              />
            </FormItem>
            <FormItem
              name="client"
              layout={formItemLayout}
              label={
                <span>
                  <FormattedMessage id="form.client.label" />
                  <em className={styles.optional}>
                    <FormattedMessage id="form.optional" />
                    <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              <Input placeholder={formatMessage({ id: 'form.client.placeholder' })} />
            </FormItem>
            <FormItem
              name="invites"
              layout={formItemLayout}
              label={
                <span>
                  <FormattedMessage id="form.invites.label" />
                  <em className={styles.optional}>
                    <FormattedMessage id="form.optional" />
                  </em>
                </span>
              }
            >
              <Input placeholder={formatMessage({ id: 'form.invites.placeholder' })} />
            </FormItem>
            <FormItem
              defaultMinWidth={false}
              name="weight"
              layout={submitLayout}
              label={
                <span>
                  <FormattedMessage id="form.weight.label" />
                  <em className={styles.optional}>
                    <FormattedMessage id="form.optional" />
                  </em>
                </span>
              }
              suffix={<span className="ant-form-text">%</span>}
            >
              <InputNumber
                placeholder={formatMessage({ id: 'form.weight.placeholder' })}
                min={0}
                max={100}
              />
            </FormItem>
            <FormItem
              name="public"
              layout={formItemLayout}
              label={<FormattedMessage id="form.public.label" />}
              help={<FormattedMessage id="form.public.label.help" />}
            >
              <Radio.Group
                options={[
                    { label: formatMessage({ id: 'form.public.radio.public' }), value: '1' },
                    { label: formatMessage({ id: 'form.public.radio.partially-public' }), value: '2' },
                    { label: formatMessage({ id: 'form.public.radio.private' }), value: '3' }
                ]}
              />
            </FormItem>
            <If when={(values) => values.public === '2'}>
              <FormItem layout={formItemLayout} name="publicUsers" label="">
                <Select
                  mode="multiple"
                  placeholder={formatMessage({ id: 'form.publicUsers.placeholder' })}
                  style={{ margin: '8px 0' }}
                  options={[
                      { label: formatMessage({ id: 'form.publicUsers.option.A' }), value: '1' },
                      { label: formatMessage({ id: 'form.publicUsers.option.B' }), value: '2' },
                      { label: formatMessage({ id: 'form.publicUsers.option.C' }), value: '3' }
                  ]}
                />    
              </FormItem>
            </If>
            <FormItem layout={submitLayout} style={{ marginTop: 32 }} full={false}>
              <Button type="primary" htmlType="submit" loading={submitting} onClick={this.handleSubmit}>
                <FormattedMessage id="form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
