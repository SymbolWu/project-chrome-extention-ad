import React, { useState } from 'react';
import { Collapse, Empty, Button, Card, Popover, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import RuleItem from '../RuleItem';
// import { getLocalStorageRules, setLocalStorageRules } from './utils';
import styles from './style.less';

const { Panel } = Collapse;

interface RuleProps {
  id: string;
  URL: string;
  webName: string;
  elementId?: string[];
  elementClassName?: string[];
}

const getLocalStorageRules = () => {
  const rulesInLoacalStorage = localStorage.getItem('WXBADRemove');
  if (rulesInLoacalStorage) {
    const rules = JSON.parse(rulesInLoacalStorage);
    return rules;
  } else {
    return []
  }
}
const setLocalStorageRules = (rules: any[]) => {
  const rulesString = JSON.stringify(rules);
  localStorage.setItem('WXBADRemove', rulesString);
}

const getID = (length: number) => {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}

const App = () => {
  let addForm: any = null;
  const [rules, setRules] = useState(getLocalStorageRules());
  const [visible, setVisible] = useState(false);
  const onVisibleChange = (visible: boolean) => {
    if (!visible) {
      addForm.resetFields();
    }
    setVisible(visible);
  }
  const getForm = (form: any) => {
    addForm = form;
  }
  const getValue = async (values: any) => {
    const newRules = rules.concat();
    if (values.id) {
      const index = rules.findIndex((rule: any) => rule.id === values.id);
      newRules.splice(index, 1, values);
    } else {
      const rule = { ...values, id: getID(6) }
      newRules.push(rule);
      addForm.resetFields();
      setVisible(false);
    }
    setRules(newRules);
    setLocalStorageRules(newRules);
  }

  const deleteRule = (id: string) => {
    const newRules = rules.concat();
    const index = rules.findIndex((rule: any) => rule.id === id);
    newRules.splice(index, 1);
    setRules(newRules);
    setLocalStorageRules(newRules);
  }

  const genExtra = (ruleId: string) => (
    <>
      <Popconfirm
        title="确定删除?"
        onConfirm={(event: any) => {
          event.stopPropagation();
          deleteRule(ruleId)
        }}
        onCancel={(event: any) => {
          event.stopPropagation();
        }}
        okText="是"
        cancelText="否"
      >
        <DeleteOutlined
          onClick={event => { event.stopPropagation() }}
        />
      </Popconfirm>
    </>
  );
  return (
    <div className={styles.container}>
      <Card
        title="屏蔽规则"
        extra={
          <Popover
            content={
              <div style={{ padding: '16px', width: '625px' }}>
                <RuleItem value={{}} sendForm={getForm} sendValue={getValue} />
              </div>
            }
            visible={visible}
            onVisibleChange={onVisibleChange}
            placement="bottomRight"
            trigger="click"
          >
            <Button type="primary">添加规则</Button>
          </Popover>
        }
      >
        {
          rules.length
            ? (
              <Collapse>
                {
                  rules.map((rule: any) => (
                    <Panel header={rule.webName} key={rule.id} extra={genExtra(rule.id)}>
                      <RuleItem value={rule} sendValue={getValue} />
                    </Panel>
                  ))
                }
              </Collapse>
            )
            : <Empty />
        }
      </Card>
      {/* <div>
        <div>content</div>
        <div className="ADTest">AD className</div>
        <div id="ADremove">AD ID</div>
        <div style={
          {
            width: '200px',
            height: '200px',
            position: 'fixed',
            backgroundColor: 'yellow',
            bottom: '0px',
            right: '0px'
          }
        }></div>
      </div> */}
    </div>
  )
}

export default App;
