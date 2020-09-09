import { gettext } from 'gettext-lib';

const functionMock = _ => _;

const PipelineOpeartor = () => {
  const usage = 'Foo' |> functionMock;
  gettext('Pipeline operator works');
};

export default PipelineOpeartor;
