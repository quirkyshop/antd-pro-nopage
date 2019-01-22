import React, { PureComponent } from 'react';
import { Card, Icon, Col, Row, Popover } from 'antd';
import { Input, TimePicker, DatePicker, Button, Select } from 'nowrapper/lib/antd';
import { InlineRepeater } from 'nowrapper/lib/antd/repeater';
import { connect } from 'dva';
import Form, { FormItem, Item, FormCore } from 'noform';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './TableForm';
import styles from './style.less';

const { RangePicker } = DatePicker;

const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
};

const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

const admins = [
  { value: "xiao", label: "付晓晓" },
  { value: "mao", label: "周毛毛" }
];
const warehouses = [
  { value: "private", label: "私密" },
  { value: "public", label: "公开" }
];

const memberConfig = {
  validateConfig: {
    name: [{ required: true, message: 'name is required' }],
    workId: [{ required: true, message: 'workId is required' }],
    department: [{ required: true, message: 'department is required' }],
  }
}


@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
class AdvancedForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: '100%'
    };

    this.core = new FormCore({
      autoValidate: true,
      validateConfig: {
          name: [{ required: true, message: '请输入仓库名称' }],
          name2: [{ required: true, message: '请输入' }],
          url: [{ required: true, message: '请选择' }],
          url2: [{ required: true, message: '请输入' }],
          owner: [{ required: true, message: '请选择管理员' }],
          owner2: [{ required: true, message: '请选择管理员' }],
          approver: [{ required: true, message: '请选择审批员' }],
          approver2: [{ required: true, message: '请选择审批员' }],
          dateRange: [{ required: true, message: '请选择生效日期' }],
          dateRange2: [{ required: true, message: '请输入提醒时间' }],
          type: [{ required: true, message: '请选择仓库类型' }],
          type2: [{ required: true, message: '请选择仓库类型' }],          
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => (<Item
    listenError
    render={(values, ctx) => {
      const errors = ctx.getError();
      if (!errors) return null;

      const errorCount = Object.keys(errors || {}).filter(key => !!errors[key]).length;
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }

        return (
          <li
            key={key}
            className={styles.errorListItem}
            onClick={() => {
              const errorKey = ctx.children.find(item => item.name === key);
              ctx.scrollToError(errorKey);
          }}
          >
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (<span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>);
    }}
  />);

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = async () => {
    const { dispatch } = this.props;
    const err = await this.core.validate();
    if (err) {
      this.core.scrollToError();
    } else {
      const values = this.core.getValues();
      dispatch({
        type: 'form/submitAdvancedForm',
        payload: values,
      });
    }
  };

  render() {
    const { submitting } = this.props;
    const { width } = this.state;

    return (
      <PageHeaderWrapper
        title="高级表单"
        content="高级表单常见于一次性输入和提交大批量数据的场景。"
        wrapperClassName={styles.advancedForm}
      >
        <Form core={this.core} direction="vertical-top" full>
          <Card title="仓库管理" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label={fieldLabels.name} name="name"><Input placeholder="请输入仓库名称" /></FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem label={fieldLabels.url} name="url">
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="http://"
                    addonAfter=".com"
                    placeholder="请输入"
                  />
                </FormItem>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <FormItem label={fieldLabels.owner} name="owner"><Select placeholder="请选择管理员" options={admins} /></FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label={fieldLabels.approver} name="approver"><Select placeholder="请选择审批员" options={admins} /></FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem label={fieldLabels.dateRange} name="dateRange"><RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} /></FormItem>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <FormItem label={fieldLabels.type} name="type"><Select placeholder="请选择仓库类型" options={warehouses} /></FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="任务管理" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label={fieldLabels.name2} name="name2"><Input placeholder="请输入" /></FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem label={fieldLabels.url2} name="url2"><Input placeholder="请输入" /></FormItem>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <FormItem label={fieldLabels.owner2} name="owner2"><Select placeholder="请选择管理员" options={admins} /></FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label={fieldLabels.approver2} name="approver2"><Select placeholder="请选择审批员" options={admins} /></FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem label={fieldLabels.dateRange2} name="dateRange2">
                  <TimePicker
                    placeholder="提醒时间"
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                </FormItem>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <FormItem label={fieldLabels.type2} name="type2"><Select placeholder="请选择仓库类型" options={warehouses} /></FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="成员管理" bordered={false}>
            <FormItem name="members" defaultValue={tableData} full>
              <InlineRepeater
                locale="zh"
                addPosition="bottom"
                addText={<div>添加成员</div>}
                formConfig={memberConfig}
                full
              >
                <FormItem label="成员姓名" name="name"><Input /></FormItem>
                <FormItem label="工号" name="workId"><Input /></FormItem>
                <FormItem label="所属部门" name="department"><Input /></FormItem>
              </InlineRepeater>
            </FormItem>
          </Card>
          <FooterToolbar style={{ width }}>
            {this.getErrorInfo()}
            <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
            </Button>
          </FooterToolbar>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
