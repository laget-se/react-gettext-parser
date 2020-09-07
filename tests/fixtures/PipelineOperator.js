import { gettext } from 'gettext-lib';

const functionMock = (param) => param;

const PipelineOpeartor = () => {
  const usage = 'Foo' |> functionMock;
  gettext('Optional chaining works');
};

export default PipelineOpeartor;
