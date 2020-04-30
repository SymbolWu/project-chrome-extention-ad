import React, { useState, useEffect } from 'react';
import { Collapse, Empty, Button, Card, Popover, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, PoweroffOutlined } from '@ant-design/icons';
import RuleItem from '../RuleItem';
// import { sendMessageBack } from '../sendMessage'
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
/**
	 * 向background发送消息
	 * @params strAction string 执行方法
	 * @params data 数据
	 * @params callback function 回调函数
	 */
const sendMessageBack = (action: string, data: any, callback: Function) => {
  chrome.extension.sendMessage({ 'action': action, 'data': data }, callback);
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
  const [rules, setRules] = useState<any[]>([]);
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
    sendMessageBack('save', newRules, (result: boolean) => {
      if (result) {
        setRules(newRules);
      }
    })
    // setRules(newRules);
    // setLocalStorageRules(newRules);
  }
  const deleteRule = (id: string) => {
    const newRules = rules.concat();
    const index = rules.findIndex((rule: any) => rule.id === id);
    newRules.splice(index, 1);
    setRules(newRules);
    setLocalStorageRules(newRules);
  }
  const entryTargetSite = (url: string) => {
    window.open(url, '_blank');
  }
  const genExtra = (rule: any) => (
    <>
      <Tooltip title="进入网站">
        <PoweroffOutlined
          className={styles.entry}
          onClick={event => {
            event.stopPropagation();
            entryTargetSite(rule.URL);
          }}
        />
      </Tooltip>

      <Popconfirm
        title="确定删除?"
        onConfirm={(event: any) => {
          event.stopPropagation();
          deleteRule(rule.id)
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
  useEffect(() => {
    sendMessageBack('list', {}, (rules: any[]) => {
      console.log('rules::', rules);
      setRules(rules || []);
    })
  }, [])
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
          rules && rules.length
            ? (
              <Collapse>
                {
                  rules.map((rule: any) => (
                    <Panel header={rule.webName} key={rule.id} extra={genExtra(rule)}>
                      <RuleItem value={rule} sendValue={getValue} />
                    </Panel>
                  ))
                }
              </Collapse>
            )
            : <Empty />
        }
      </Card>
    </div>
  )
}

export default App;
