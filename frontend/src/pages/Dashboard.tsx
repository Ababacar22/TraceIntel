import { Heading, Text, Flex, SimpleGrid, Icon, VStack, Box } from '@chakra-ui/react';
import { GlassCard } from '../components/GlassCard';
import { Activity, ShieldAlert, Crosshair } from 'lucide-react';

import React from 'react';

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ElementType, color: string }) => (
    <GlassCard display="flex" alignItems="center" gap={4}>
        <Flex
            w="12" h="12" borderRadius="full"
            bg={`color-mix(in srgb, ${color} 15%, transparent)`}
            alignItems="center" justifyContent="center"
            color={color}
        >
            <Icon as={icon} boxSize={6} />
        </Flex>
        <VStack align="flex-start" gap={0}>
            <Text color="text.muted" fontSize="sm">{title}</Text>
            <Heading size="lg">{value}</Heading>
        </VStack>
    </GlassCard>
);

export const Dashboard = () => {
    return (
        <Box>
            <Flex justify="space-between" align="center" mb={8}>
                <Box>
                    <Heading size="2xl" mb={2}>Intelligence Overview</Heading>
                    <Text color="text.muted">Real-time stats of the TraceIntel network.</Text>
                </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
                <StatCard title="Active Investigations" value="12" icon={Activity} color="#00ffff" />
                <StatCard title="Nodes Discovered" value="3,492" icon={Crosshair} color="#ff00ff" />
                <StatCard title="High Risk Alerts" value="8" icon={ShieldAlert} color="#ff3333" />
            </SimpleGrid>

            <Heading size="md" mb={4}>Recent Activity</Heading>
            <GlassCard h="300px" display="flex" alignItems="center" justifyContent="center">
                <Text color="text.muted">Interactive Network Graph Will Render Here</Text>
            </GlassCard>
        </Box>
    );
};
