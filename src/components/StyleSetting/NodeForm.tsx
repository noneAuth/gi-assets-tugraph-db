import {
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Form,
  FormInstance,
  FormProps,
  Input,
  Radio,
  Select,
} from "antd";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import CustomIcon from "./CustomIcon";
import ColorInput from "./ColorInput";
import { DefaultColor, getOperatorList, ICONS } from "./Constant";
import IntegerStep from "./IntegerStep";

interface NodeFormProps extends FormProps {
  form: FormInstance<any>;
  onNodeTypeChange?: (nodeType?: string) => void;
  schemaData: {
    nodes: any[];
    edges: any[];
  };
}

const { Option } = Select;
const { Panel } = Collapse;

export const NodeForm: React.FC<NodeFormProps> = ({
  form,
  onValuesChange,
  initialValues,
  onNodeTypeChange,
  schemaData,
  ...otherProps
}) => {
  console.log('initialValues', initialValues)
  const [state, setState] = useImmer<{
    color: {
      basic: string;
      advanced: string;
    };

    currentSchema: any;
    property: any[];
    labelText: string;
  }>({
    color: {
      basic: initialValues?.customColor || initialValues?.color,
      advanced: initialValues?.advancedCustomColor || initialValues?.advancedColor
    },

    currentSchema: {},
    property: [],
    labelText: 'id'
  });
  const { color, currentSchema, property } = state;

  const handleChangeBasicColor = (e) => {
    // 设置选择的默认颜色
    setState((draft) => {
      draft.color = {
        ...color,
        basic: e.target.value
      };
    });
    form.setFieldsValue({
      customColor: undefined
    });
  };

  const handleColorChange = (current) => {
    setState((draft) => {
      draft.color = {
        ...color,
        basic: current
      };
    });
    form.setFieldsValue({
      color: current
    });
  };

  const handleChangeAdvancedColor = (e) => {
    // 设置选择的默认颜色
    setState((draft) => {
      draft.color = {
        ...color,
        advanced: e.target.value
      };
    });
    form.setFieldsValue({
      advancedCustomColor: undefined
    });
  };

  const handleAdvancedColorChange = (current) => {
    setState((draft) => {
      draft.color = {
        ...color,
        advanced: current
      };
    });
    form.setFieldsValue({
      advancedColor: current
    });
  };

  const handleFormValueChange = (changedValues, allValues) => {
    if (onValuesChange) {
      onValuesChange(changedValues, allValues);
    }
    const { nodeType, property } = allValues;

    // 修改 nodeType 以后，更新 Schema 的属性
    if (nodeType) {
      const currentNodeSchemas = schemaData.nodes.filter((node: any) => node.labelName === nodeType);
      if (currentNodeSchemas.length > 0) {
        setState((draft) => {
          draft.currentSchema = currentNodeSchemas[0];
        });
      }
    } else {
      // 清空了 nodeType，则重置属性
      setState((draft) => {
        draft.currentSchema = {};
      });
    }

    if ("nodeType" in changedValues && initialValues) {
      const curNodeStyles = initialValues[changedValues.nodeType || "allNodes"] || {};
      if (curNodeStyles) {
        setState((draft) => {
          draft.color.basic = curNodeStyles.color;
          draft.color.advanced = curNodeStyles.advancedColor;
          draft.property = curNodeStyles.property;
          draft.labelText = curNodeStyles.labelText
        });
      }
    }
    if ("property" in changedValues) {
      setState((draft) => {
        draft.property = property;
      });
    }
    if ("nodeType" in changedValues) {
      onNodeTypeChange?.(changedValues.nodeType);
    }
  };

  const propertyOptions = currentSchema.properties?.map((d) => {
    return (
      <Option value={d.name} key={d.name}>
        {d.name}
      </Option>
    );
  });

  useEffect(() => {
    onValuesChange?.({ nodeType: null }, initialValues);
  }, []);

  const handleChangeLableText = (evt) => {
    setState(draft => {
      draft.labelText = evt.target.value
    })
  }

  console.log('currentSchema', currentSchema)

  return (
    <Form
      {...otherProps}
      form={form}
      name='nodeConfigurationForm'
      layout='vertical'
      onValuesChange={handleFormValueChange}
    >
      <Form.Item name='nodeType' label='应用点类型'>
        <Select placeholder='请选择节点类型' showSearch allowClear>
          {schemaData.nodes?.map((node: any) => {
            return (
              <Option value={node.labelName} key={node.labelName}>
                {node.labelName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name='size' label='大小' initialValue={30}>
        <IntegerStep />
      </Form.Item>

      <div className='color'>
        <Form.Item name='color' label='颜色'>
          <Radio.Group onChange={handleChangeBasicColor}>
            {DefaultColor.map((color) => (
              <Radio className='custom-ant-radio-wrapper' key={color} value={color} style={{ background: color }} />
            ))}
            <Radio
              className='custom-ant-radio-wrapper'
              key={`${color.basic || "custom_color"}`}
              value={`${color.basic || "custom_color"}`}
              style={{ background: color.basic }}
            ></Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name='customColor' label=' '>
          <ColorInput onChange={handleColorChange} />
        </Form.Item>
      </div>

      <Form.Item name={["icon", "iconText"]} label='图标'>
        <Radio.Group optionType='button' buttonStyle='solid'>
          {ICONS.map((icon: any) => (
            <Radio.Button
              key={icon.key}
              value={icon.key}
              className='custom-ant-radio-wrapper'
              style={{
                border: "none",
                lineHeight: "25px",
                padding: "0 1px",
                width: 25,
                height: 25
              }}
            >
              <CustomIcon
                type={icon.value}
                style={{
                  fontSize: 23,
                  cursor: "pointer"
                }}
              />
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item label='文本' name='labelText'>
        <Radio.Group onChange={handleChangeLableText} value={state.labelText}>
          <Radio value='id'>显示ID</Radio>
          <Radio value='property'>显示属性</Radio>
        </Radio.Group>
      </Form.Item>

      {
        state.labelText === 'property' &&
        <Form.Item name='displyLabel' label='文本对应属性' initialValue='ID'>
          <Select
            placeholder='请选择属性'
            showSearch
            allowClear
            mode='multiple'
            disabled={!currentSchema.properties}
          >
            {propertyOptions}
          </Select>
        </Form.Item>
      }
          
      <Collapse
        bordered={false}
        ghost
        // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className='site-collapse-custom-collapse'
      >
        <Panel header='高级自定义' key='1' className='site-collapse-custom-panel' forceRender>
          <div style={{ marginBottom: 16 }}>属性</div>
          <Form.List name='property'>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <span key={key} style={{ display: "inline-block", marginBottom: 8 }}>
                      <Form.Item {...restField} name={[name, "name"]} noStyle>
                        <Select
                          placeholder='请选择'
                          showSearch
                          allowClear
                          style={{ width: '33%', marginRight: 8 }}
                          disabled={!currentSchema.properties}
                        >
                          {propertyOptions}
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "operator"]} noStyle>
                        <Select
                          placeholder='请选择'
                          showSearch
                          allowClear
                          style={{ width: '33%', marginRight: 8 }}
                        >
                          {
                            getOperatorList(
                              property && property[key]?.name
                                ? currentSchema.properties.find(d => d.name === property[key]?.name)?.type
                                : undefined
                          ).map((op) => {
                            return (
                              <Option value={op.key} key={op.key}>
                                {op.value}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "value"]} noStyle>
                        <Input style={{ width: '19%', marginRight: 8 }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </span>
                  ))}
                  <Form.Item>
                    <Button
                      type='dashed'
                      disabled={!currentSchema.properties}
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加属性过滤条件
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
          <div className='color'>
            <Form.Item name='advancedColor' label='属性颜色'>
              <Radio.Group onChange={handleChangeAdvancedColor}>
                {DefaultColor.map((color) => (
                  <span
                    key={color}
                    className='colorItem'
                    style={{
                      border: `1px solid ${color}`
                    }}
                  >
                    <Radio className='custom-ant-radio-wrapper' key={color} value={color} style={{ background: color }} />
                  </span>
                ))}
                <span
                  className='colorItem'
                  style={{
                    border: `1px dashed ${color.advanced}`
                  }}
                >
                  <Radio
                    className='custom-ant-radio-wrapper'
                    key={`${color.advanced}`}
                    value={`${color.advanced}`}
                    style={{ background: color.advanced }}
                  ></Radio>
                </span>
              </Radio.Group>
            </Form.Item>
            <Form.Item name='advancedCustomColor' label=' '>
              <ColorInput onChange={handleAdvancedColorChange} />
            </Form.Item>
          </div>
        </Panel>
      </Collapse>
    </Form>
  );
};
