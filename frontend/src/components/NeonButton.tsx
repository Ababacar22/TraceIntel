import { Button, type ButtonProps } from '@chakra-ui/react';

export const NeonButton = (props: ButtonProps) => {
    return (
        <Button
            bg="rgba(0, 255, 255, 0.1)"
            color="#00ffff"
            borderWidth="1px"
            borderColor="border.neon"
            _hover={{
                bg: "rgba(0, 255, 255, 0.2)",
                boxShadow: "neon",
                transform: "translateY(-1px)",
            }}
            transition="all 0.2s"
            {...props}
        />
    );
};
