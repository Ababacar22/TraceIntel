import { Box, Flex, VStack, Text, Icon } from '@chakra-ui/react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { Shield, Activity, Settings, LayoutDashboard } from 'lucide-react';

import React from 'react';

const SidebarItem = ({ icon, label, to }: { icon: React.ElementType, label: string, to: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <RouterLink to={to} style={{ width: '100%', textDecoration: 'none' }}>
            <Box
                w="full"
                p={3}
                borderRadius="md"
                display="flex"
                alignItems="center"
                position="relative"
                color={isActive ? "text.accent" : "text.muted"}
                bg={isActive ? "whiteAlpha.100" : "transparent"}
                _hover={{ bg: "whiteAlpha.200", color: "text.primary" }}
                transition="all 0.2s"
            >
                {isActive && (
                    <Box
                        position="absolute" left="-4px" top="20%" bottom="20%" w="3px"
                        bg="text.accent" borderRadius="full" boxShadow="neon"
                    />
                )}
                <Icon as={icon} mr={3} boxSize="5" />
                <Text fontWeight={isActive ? "600" : "500"}>{label}</Text>
            </Box>
        </RouterLink>
    );
};

export const Layout = () => {
    return (
        <Flex minH="100vh">
            {/* Sidebar */}
            <Box
                w="280px"
                borderRightWidth="1px"
                borderColor="whiteAlpha.200"
                bg="bg.panel"
                backdropFilter="blur(10px)"
                p={6}
                display="flex"
                flexDirection="column"
            >
                <Flex alignItems="center" mb={10} gap={3}>
                    <Shield color="#00ffff" size={32} />
                    <Text fontSize="2xl" fontWeight="bold" letterSpacing="tight" color="white">
                        Trace<Text as="span" color="text.accent">Intel</Text>
                    </Text>
                </Flex>

                <VStack align="start" w="full">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
                    <SidebarItem icon={Activity} label="Investigations" to="/investigations" />
                    <SidebarItem icon={Settings} label="Settings" to="/settings" />
                </VStack>
            </Box>

            {/* Main Content Area */}
            <Box flex="1" p={8} overflowY="auto">
                <Outlet />
            </Box>
        </Flex>
    );
};
