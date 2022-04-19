import {
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { FaArrowRight } from "react-icons/fa";

const OrderSummaryItem = ({ label, value, children }) => {
  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={"gray.600"}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  );
};

export const CartOrderSummary = ({ subtotal, line_total }) => {
  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
      <Heading size="md">Order Summary</Heading>
      <Stack spacing="6">
        <OrderSummaryItem
          label="Subtotal"
          value={subtotal.formatted_with_symbol}
        />
        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Total Price
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            {subtotal.formatted_with_symbol}
          </Text>
        </Flex>
        <OrderSummaryItem label="Shipping & taxes calculated at checkout"></OrderSummaryItem>
      </Stack>
      <Button
        colorScheme="red"
        size="lg"
        fontSize="md"
        rightIcon={<FaArrowRight />}
      >
        Checkout
      </Button>
    </Stack>
  );
};
