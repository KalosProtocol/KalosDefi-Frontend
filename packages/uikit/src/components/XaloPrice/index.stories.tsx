import React from "react";
import { XaloPrice, XaloPriceProps } from ".";
import { Flex } from "../Box";

export default {
  title: "Components/XaloPrice",
  component: XaloPrice,
};

const Template: React.FC<XaloPriceProps> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <XaloPrice {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  xaloPriceUsd: 20.0,
};
