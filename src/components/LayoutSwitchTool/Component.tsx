import React from 'react';
import type { GILayoutConfig, IGIAC } from '@antv/gi-sdk';
import { useImmer } from 'use-immer';
import { LayoutConfig } from '@antv/gi-sdk/lib/typing';
import { useContext, utils } from '@antv/gi-sdk';
import { Popover } from 'antd';
import './index.less';

export interface LayoutSwitchProps {
  GIAC: IGIAC;
  controlledValues?: LayoutConfig;
}
let timer: NodeJS.Timer;
const LayoutSwitchTool: React.FC<LayoutSwitchProps> = props => {
  const { GIAC, controlledValues } = props;
  const [state, setState] = useImmer<{
    visible: boolean;
    dataList: any[];
  }>({
    visible: true,
    dataList: [
      {
        id: '0',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*KgwCS5Fjk4MAAAAAAAAAAAAADgOBAQ/original',
        name: '力导向布局',
      },
      {
        id: '1',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*9gpaQ5eqdOQAAAAAAAAAAAAADgOBAQ/original',
        name: '同心圆布局',
      },
      {
        id: '2',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*ezH8SaMfW64AAAAAAAAAAAAADgOBAQ/original',
        name: '圆形布局',
      },
      {
        id: '3',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*CI8CR7hqvfUAAAAAAAAAAAAADgOBAQ/original',
        name: '辐射布局',
      },
      {
        id: '4',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*HJ4PTLLqPuIAAAAAAAAAAAAADgOBAQ/original',
        name: 'Dagre布局',
      },
      {
        id: '5',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*LTrgQ6SDHzIAAAAAAAAAAAAADgOBAQ/original',
        name: '分类Dagre布局',
      },
      {
        id: '6',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*w_oiR5W9BBcAAAAAAAAAAAAADgOBAQ/original',
        name: '网格布局',
      },
    ],
  });
  const { assets, config, data, schemaData, updateContext, layout, graph } = useContext();
  const { layouts = {} } = assets;
  const PopoverItem = ({ id, src, name }) => {
    const handleClick = (layoutConfig: GILayoutConfig) => {
      let layoutProps = { ...layoutConfig.props };
      if (config.layout.id === layoutConfig.id) {
        layoutProps = {
          ...layoutProps,
          ...config.layout.props,
        };
      }
      updateContext(draft => {
        draft.layout = layoutProps;
        draft.config.layout = {
          id: layoutConfig.id,
          props: layoutProps,
        };
        draft.layoutCache = false;
      });
      clearTimeout(timer);
      timer = setTimeout(() => {
        graph.fitCenter(true);
      }, 60);
    };
    return (
      <div
        className="popoverItem"
        onClick={() => {
          console.log(id);
          handleClick({ id, props: {} });
        }}
      >
        <img src={src} className="pic" />
        <div className="text">{name}</div>
      </div>
    );
  };
  return (
    <div className="popoverContainer">
      <Popover visible={state.visible} title={null} placement="bottomRight">
        <div className="popoverContent">
          {state.dataList.map(item => {
            return <PopoverItem key={item?.id} src={item?.src} name={item?.name} id={item?.id} />;
          })}
        </div>
      </Popover>
    </div>
  );
};

export default LayoutSwitchTool;
