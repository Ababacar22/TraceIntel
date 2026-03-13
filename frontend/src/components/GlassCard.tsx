import { Box, type BoxProps } from '@chakra-ui/react';

export const GlassCard = (props: BoxProps) => {
    return (
        <Box
            bg="bg.panel"
            backdropFilter="blur(16px)"
            borderWidth="1px"
            borderColor="border.glass"
            borderRadius="xl"
            p={6}
            shadow="none"
            transition="all 0.3s ease"
            _hover={{
                borderColor: "border.neon",
                boxShadow: "neon",
            }}
            {...props}
        />
    );
};
