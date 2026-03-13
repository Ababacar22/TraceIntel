import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Heading, Flex, Text, VStack, Input,
    SimpleGrid, Badge, Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';

export const Investigations = () => {
    const [investigations, setInvestigations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [targetType, setTargetType] = useState('EMAIL_ADDRESS');
    const [targetValue, setTargetValue] = useState('');
    const [title, setTitle] = useState('');

    const fetchInvestigations = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/investigations');
            setInvestigations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchInvestigations();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetValue) return;

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/investigations', {
                title: title || `Target: ${targetValue}`,
                targets: [{ targetType, targetValue }]
            });
            setTargetValue('');
            setTitle('');
            await fetchInvestigations();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Flex justify="space-between" align="flex-end" mb={8}>
                <Box>
                    <Heading size="2xl" mb={2}>Active Investigations</Heading>
                    <Text color="text.muted">Launch and monitor OSINT operations.</Text>
                </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} mb={10}>
                {/* Launch New Operation Panel */}
                <GlassCard gridColumn={{ lg: "span 1" }}>
                    <Heading size="md" mb={6} color="text.accent">Launch Operation</Heading>
                    <form onSubmit={handleSubmit}>
                        <VStack align="stretch" gap={4}>
                            <Box>
                                <Text mb={2} fontSize="sm" color="text.muted">Operation Name (Optional)</Text>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Dark Web Scan 1"
                                    bg="whiteAlpha.50"
                                    borderColor="whiteAlpha.300"
                                    _focus={{ borderColor: "text.accent", boxShadow: "neon" }}
                                />
                            </Box>
                            <Box>
                                <Text mb={2} fontSize="sm" color="text.muted">Target Type</Text>
                                <select
                                    value={targetType}
                                    onChange={(e) => setTargetType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '0.375rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        color: 'white',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="EMAIL_ADDRESS" style={{ color: 'black' }}>Email Address</option>
                                    <option value="DOMAIN_NAME" style={{ color: 'black' }}>Domain Name</option>
                                    <option value="USERNAME" style={{ color: 'black' }}>Username / Pseudo</option>
                                    <option value="PHONE_NUMBER" style={{ color: 'black' }}>Phone Number</option>
                                </select>
                            </Box>
                            <Box>
                                <Text mb={2} fontSize="sm" color="text.muted">Target Node</Text>
                                <Input
                                    value={targetValue}
                                    onChange={(e) => setTargetValue(e.target.value)}
                                    placeholder={targetType === 'EMAIL_ADDRESS' ? "target@example.com" : targetType === 'DOMAIN_NAME' ? "example.com" : "target_name"}
                                    bg="whiteAlpha.50"
                                    borderColor="whiteAlpha.300"
                                    _focus={{ borderColor: "text.accent", boxShadow: "neon" }}
                                    required
                                />
                            </Box>
                            <Box pt={2}>
                                <NeonButton type="submit" w="full" disabled={loading}>
                                    {loading ? <Spinner size="sm" /> : "Deploy Modules"}
                                </NeonButton>
                            </Box>
                        </VStack>
                    </form>
                </GlassCard>

                {/* List of Investigations */}
                <Box gridColumn={{ lg: "span 2" }}>
                    <Heading size="md" mb={6}>Recent Activity Log</Heading>
                    <VStack align="stretch" gap={4}>
                        {investigations.map((inv) => (
                            <RouterLink
                                to={`/investigations/${inv.id}`}
                                key={inv.id}
                                style={{ textDecoration: 'none', display: 'block' }}
                            >
                                <Box
                                    transition="transform 0.2s"
                                    _hover={{ transform: "scale(1.02)" }}
                                >
                                    <GlassCard p={4} display="flex" justifyContent="space-between" alignItems="center" cursor="pointer">
                                        <Box>
                                            <Heading size="sm" mb={1}>{inv.title || 'Unnamed Operation'}</Heading>
                                            <Text fontSize="xs" color="text.muted" fontFamily="monospace">
                                                ID: {inv.id.split('-')[0]}... | Started: {new Date(inv.createdAt).toLocaleString()}
                                            </Text>
                                        </Box>
                                        <Badge
                                            colorPalette={inv.status === 'PENDING' ? 'yellow' : inv.status === 'RUNNING' ? 'cyan' : inv.status === 'COMPLETED' ? 'green' : 'gray'}
                                            variant="subtle" px={3} py={1} borderRadius="full"
                                        >
                                            {inv.status}
                                        </Badge>
                                    </GlassCard>
                                </Box>
                            </RouterLink>
                        ))}
                        {investigations.length === 0 && (
                            <GlassCard p={8} textAlign="center">
                                <Text color="text.muted">No active investigations.</Text>
                            </GlassCard>
                        )}
                    </VStack>
                </Box>
            </SimpleGrid>
        </Box>
    );
};
