import { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Box, Heading, Flex, Text, VStack, Badge,
    SimpleGrid, Button, Breadcrumb, Spinner,
    DialogRoot, DialogContent, DialogHeader, DialogBody,
    DialogCloseTrigger, DialogBackdrop, DialogTitle
} from '@chakra-ui/react';
import axios from 'axios';
import { GlassCard } from '../components/GlassCard';
import { Info, Activity, Terminal, ExternalLink, CheckCircle2, XCircle, ShieldAlert, Globe, Server, Bug } from 'lucide-react';

const getModuleDisplayName = (name: string) => {
    const map: any = {
        'holehe': 'Social Media Presence (Holehe)',
        'haveibeenpwned': 'Data Breach Check (HIBP)',
        'whois': 'Domain Registration (WhoIs)',
        'sublist3r': 'Subdomain Enumeration (Sublist3r)',
        'nuclei': 'Vulnerability Scanning (Nuclei)'
    };
    return map[name] || name;
};

const getModuleDescription = (name: string) => {
    const map: any = {
        'holehe': 'Checks if the target email is registered across 120+ social media platforms and websites.',
        'haveibeenpwned': 'Verifies if the target email was compromised in any public data breaches or leaks.',
        'whois': 'Retrieves public registration information and creation dates for the target domain.',
        'sublist3r': 'Discovers associated subdomains to map the external attack surface.',
        'nuclei': 'Actively scans the target for known CVEs, misconfigurations, and exposed panels.'
    };
    return map[name] || 'Raw OSINT data returned by the execution module.';
};

const ResultRenderer = ({ task }: { task: any }) => {
    const data = task?.rawResults;

    // Specialized Renderer: Nuclei
    if (task.moduleName === 'nuclei') {
        const vulns = task.vulnerabilities || [];
        if (vulns.length === 0) {
            return (
                <Flex align="center" gap={3} color="green.400" p={5} bg="green.900/10" borderRadius="lg" border="1px solid" borderColor="green.500/30">
                    <CheckCircle2 size={32} />
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">Target is Clean</Text>
                        <Text color="green.100" fontSize="sm">No critical, high, or medium vulnerabilities discovered.</Text>
                    </Box>
                </Flex>
            );
        }

        const getBadgeColor = (severity: string) => {
            if (severity === 'critical') return 'purple';
            if (severity === 'high') return 'red';
            if (severity === 'medium') return 'orange';
            return 'blue';
        };

        return (
            <VStack align="stretch" gap={6}>
                <Flex align="center" gap={4} color="red.400" p={5} bg="red.900/10" borderRadius="lg" border="1px solid" borderColor="red.500/30">
                    <Bug size={32} />
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">Security Findings</Text>
                        <Text color="red.200" fontSize="sm">Found {vulns.length} vulnerabilities requiring attention.</Text>
                    </Box>
                </Flex>

                <Box maxH="400px" overflow="auto" p={2} bg="blackAlpha.400" borderRadius="lg" border="1px solid rgba(255,255,255,0.05)">
                    <VStack align="stretch" gap={3}>
                        {vulns.map((v: any, index: number) => (
                            <Box key={v.id || index} p={4} bg="whiteAlpha.50" borderLeft="4px solid" borderColor={`var(--chakra-colors-${getBadgeColor(v.severity)}-500)`} borderRadius="md">
                                <Flex justify="space-between" align="flex-start" mb={2}>
                                    <VStack align="flex-start" gap={0}>
                                        <Text fontWeight="bold" fontSize="md">{v.name}</Text>
                                        <Text fontSize="xs" fontFamily="monospace" color="text.muted">{v.templateId}</Text>
                                    </VStack>
                                    <Badge colorPalette={getBadgeColor(v.severity)}>{v.severity.toUpperCase()}</Badge>
                                </Flex>
                                <Text fontSize="sm" color="gray.300" mb={3}>{v.description || 'No description provided.'}</Text>
                                {v.reference && v.reference.length > 0 && (
                                    <Text fontSize="xs" color="text.muted" mb={1}>
                                        <Text as="span" fontWeight="bold">Ref: </Text>
                                        {Array.isArray(v.reference) ? v.reference[0] : v.reference}
                                    </Text>
                                )}
                                {v.matchedAt && (
                                    <Text fontSize="xs" color="text.accent" fontFamily="monospace" isTruncated maxW="100%">
                                        Match: {v.matchedAt}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </VStack>
                </Box>
            </VStack>
        );
    }

    if (!data) return <Text color="text.muted">No data found for this module.</Text>;

    // Specialized Renderer: Holehe
    if (task.moduleName === 'holehe') {
        const sites = Object.entries(data);
        const foundCount = sites.filter(([_, found]) => found).length;

        return (
            <VStack align="stretch" gap={6}>
                <Flex align="center" gap={4} color="cyan.400" p={5} bg="cyan.900/10" borderRadius="lg" border="1px solid" borderColor="cyan.500/30">
                    <Activity size={32} />
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">Digital Footprint Analysis</Text>
                        <Text color="cyan.100" fontSize="sm">Found accounts on {foundCount} out of {sites.length} checked platforms.</Text>
                    </Box>
                </Flex>

                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={3}>
                    {sites.map(([site, found]: [string, any]) => (
                        <Flex key={site} p={3} bg={found ? "whiteAlpha.100" : "whiteAlpha.50"} borderRadius="md" justify="space-between" align="center" border="1px solid" borderColor={found ? "green.500/30" : "transparent"}>
                            <Text textTransform="capitalize" fontWeight={found ? "bold" : "medium"} color={found ? "white" : "whiteAlpha.400"}>
                                {site}
                            </Text>
                            {found ? (
                                <CheckCircle2 size={16} color="var(--chakra-colors-green-400)" />
                            ) : (
                                <XCircle size={16} color="var(--chakra-colors-whiteAlpha-300)" />
                            )}
                        </Flex>
                    ))}
                </SimpleGrid>
            </VStack>
        );
    }

    // Specialized Renderer: HaveIBeenPwned
    if (task.moduleName === 'haveibeenpwned') {
        const breaches = data.breaches || [];
        if (breaches.length === 0) {
            return (
                <Flex align="center" gap={3} color="green.400" p={5} bg="green.900/10" borderRadius="lg" border="1px solid" borderColor="green.500/30">
                    <CheckCircle2 size={32} />
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">Validation Passed</Text>
                        <Text color="green.100" fontSize="sm">Excellent! No data breaches found for this email.</Text>
                    </Box>
                </Flex>
            );
        }
        return (
            <VStack align="stretch" gap={6}>
                <Flex align="center" gap={4} color="red.400" p={5} bg="red.900/10" borderRadius="lg" border="1px solid" borderColor="red.500/30">
                    <ShieldAlert size={32} />
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">Critical Security Alert</Text>
                        <Text color="red.200" fontSize="sm">{breaches.length} known data breaches detected for this target.</Text>
                    </Box>
                </Flex>

                <Box>
                    <Text fontSize="xs" color="text.muted" mb={3} textTransform="uppercase" fontWeight="bold" letterSpacing="wider">Compromised Sources</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                        {breaches.map((b: string) => (
                            <Flex key={b} p={3} bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" borderRadius="md" align="center" gap={3} _hover={{ bg: 'whiteAlpha.100' }} transition="all 0.2s">
                                <Box p={2} bg="red.500/10" borderRadius="md" color="red.400">
                                    <Globe size={16} />
                                </Box>
                                <Text fontWeight="bold" fontSize="sm">{b}</Text>
                            </Flex>
                        ))}
                    </SimpleGrid>
                </Box>
            </VStack>
        );
    }

    // Specialized Renderer: Whois
    if (task.moduleName === 'whois') {
        return (
            <VStack align="stretch" gap={6}>
                <Flex align="center" gap={4} color="purple.400" p={5} bg="purple.900/10" borderRadius="lg" border="1px solid" borderColor="purple.500/30">
                    <Globe size={32} />
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">Domain Fingerprint</Text>
                        <Text color="purple.100" fontSize="sm">Public registration and ownership records.</Text>
                    </Box>
                </Flex>

                <Box bg="blackAlpha.400" p={5} borderRadius="lg" border="1px solid rgba(255,255,255,0.05)">
                    <SimpleGrid columns={1} gap={0}>
                        {Object.entries(data).map(([key, val]: [string, any], index, array) => (
                            <Flex key={key} justify="space-between" align="center" borderBottom={index === array.length - 1 ? 'none' : '1px solid'} borderColor="whiteAlpha.100" py={3}>
                                <Text color="text.muted" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">
                                    {key.replace(/_/g, ' ')}
                                </Text>
                                <Text fontFamily="monospace" color="white" fontWeight="medium">{String(val)}</Text>
                            </Flex>
                        ))}
                    </SimpleGrid>
                </Box>
            </VStack>
        );
    }

    // Specialized Renderer: Sublist3r
    if (task.moduleName === 'sublist3r') {
        const subdomains = data.subdomains || [];
        return (
            <VStack align="stretch" gap={6}>
                <Flex align="center" gap={4} color="blue.400" p={5} bg="blue.900/10" borderRadius="lg" border="1px solid" borderColor="blue.500/30">
                    <Server size={32} />
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">Attack Surface Mapping</Text>
                        <Text color="blue.100" fontSize="sm">{subdomains.length} associated subdomains discovered.</Text>
                    </Box>
                </Flex>

                <Box maxH="400px" overflow="auto" p={5} bg="blackAlpha.400" borderRadius="lg" border="1px solid rgba(255,255,255,0.05)">
                    <VStack align="stretch" gap={0}>
                        {subdomains.map((s: string, index: number, array: any[]) => (
                            <Flex key={s} align="center" gap={3} py={2} borderBottom={index === array.length - 1 ? 'none' : '1px solid'} borderColor="whiteAlpha.100">
                                <Globe size={14} color="var(--chakra-colors-blue-400)" />
                                <Text fontSize="sm" fontFamily="monospace" color="blue.100">{s}</Text>
                            </Flex>
                        ))}
                    </VStack>
                </Box>
            </VStack>
        );
    }

    // Fallback: Code View
    return (
        <Box
            as="pre"
            p={5}
            bg="blackAlpha.400"
            borderRadius="lg"
            fontSize="xs"
            fontFamily="monospace"
            overflow="auto"
            maxH="500px"
            color="green.300"
            border="1px solid rgba(255,255,255,0.05)"
        >
            {JSON.stringify(data, null, 2)}
        </Box>
    );
};

export const InvestigationDetails = () => {
    const { id } = useParams();
    const [investigation, setInvestigation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDetails = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/investigations/${id}`);
            setInvestigation(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
        const interval = setInterval(fetchDetails, 3000);
        return () => clearInterval(interval);
    }, [fetchDetails]);

    const handleViewData = (task: any) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    if (loading) return (
        <Flex justify="center" align="center" h="60vh">
            <Spinner color="text.accent" size="xl" />
        </Flex>
    );

    if (!investigation) return <Text>Investigation not found.</Text>;

    return (
        <Box>
            <Breadcrumb.Root mb={8} color="text.muted">
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <RouterLink to="/investigations" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                            Investigations
                        </RouterLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Text fontWeight="bold">{investigation.title || 'Details'}</Text>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>

            <Flex justify="space-between" align="center" mb={10}>
                <VStack align="flex-start" gap={1}>
                    <Heading size="3xl">{investigation.title || 'Untitled Operation'}</Heading>
                    <Text color="text.muted" fontFamily="monospace">ID: {investigation.id}</Text>
                </VStack>
                <Badge
                    colorPalette={investigation.status === 'PENDING' ? 'yellow' : investigation.status === 'RUNNING' ? 'cyan' : 'green'}
                    fontSize="lg" px={6} py={2} borderRadius="full"
                >
                    {investigation.status}
                </Badge>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
                {/* Targets Sidebar */}
                <VStack align="stretch" gap={6}>
                    <GlassCard>
                        <Flex align="center" gap={2} mb={4}>
                            <Info size={18} color="var(--chakra-colors-text-accent)" />
                            <Heading size="md">Primary Targets</Heading>
                        </Flex>
                        <VStack align="stretch" gap={3}>
                            {investigation.targets.map((t: any) => (
                                <Box key={t.id} p={3} bg="whiteAlpha.100" borderRadius="md" borderLeft="4px solid" borderColor="text.accent">
                                    <Badge size="xs" mb={1} variant="outline" colorPalette="gray">{t.targetType}</Badge>
                                    <Text fontWeight="bold" fontSize="lg">{t.targetValue}</Text>
                                </Box>
                            ))}
                        </VStack>
                    </GlassCard>

                    <GlassCard>
                        <Flex align="center" gap={2} mb={4}>
                            <Activity size={18} color="var(--chakra-colors-text-accent)" />
                            <Heading size="md">Statistics</Heading>
                        </Flex>
                        <SimpleGrid columns={2} gap={4}>
                            <Box>
                                <Text fontSize="xs" color="text.muted">TOTAL TASKS</Text>
                                <Text fontSize="2xl" fontWeight="bold">{(investigation.tasks || []).length}</Text>
                            </Box>
                            <Box>
                                <Text fontSize="xs" color="text.muted">COMPLETED</Text>
                                <Text fontSize="2xl" fontWeight="bold" color="green.400">
                                    {(investigation.tasks || []).filter((t: any) => t.status === 'COMPLETED').length}
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </GlassCard>
                </VStack>

                {/* Tasks Main View */}
                <Box gridColumn={{ md: "span 2" }}>
                    <VStack align="stretch" gap={6}>
                        <Heading size="lg" display="flex" alignItems="center" gap={3}>
                            <Terminal size={24} />
                            Execution Timeline
                        </Heading>

                        {(investigation.tasks || []).map((task: any) => (
                            <GlassCard key={task.id} p={6}>
                                <Flex justify="space-between" align="center">
                                    <VStack align="flex-start" gap={1}>
                                        <Flex align="center" gap={3}>
                                            <Heading size="md" color="text.accent">{task.moduleName}</Heading>
                                            <Badge colorPalette={task.status === 'PENDING' ? 'yellow' : task.status === 'RUNNING' ? 'cyan' : 'green'}>
                                                {task.status}
                                            </Badge>
                                        </Flex>
                                        <Text fontSize="sm" color="text.muted">
                                            Last update: {new Date(task.updatedAt).toLocaleTimeString()}
                                        </Text>
                                    </VStack>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        borderColor="text.accent"
                                        color="text.accent"
                                        _hover={{ bg: "text.accent", color: "white" }}
                                        disabled={task.status !== 'COMPLETED'}
                                        onClick={() => handleViewData(task)}
                                    >
                                        View Data
                                    </Button>
                                </Flex>

                                {task.errorMessage && (
                                    <Box mt={4} p={3} bg="red.900/40" borderRadius="md" border="1px solid" borderColor="red.500">
                                        <Text color="red.200" fontSize="sm">Error: {task.errorMessage}</Text>
                                    </Box>
                                )}
                            </GlassCard>
                        ))}

                        {(!investigation.tasks || investigation.tasks.length === 0) && (
                            <GlassCard p={10} textAlign="center">
                                <Text color="text.muted">No automated modules scheduled for these targets.</Text>
                            </GlassCard>
                        )}
                    </VStack>
                </Box>
            </SimpleGrid>

            {/* Results Modal */}
            <DialogRoot
                open={isModalOpen}
                onOpenChange={(e) => setIsModalOpen(e.open)}
                size="lg"
            >
                <DialogBackdrop />
                <DialogContent
                    bg="rgba(10, 10, 20, 0.9)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    color="white"
                    borderRadius="xl"
                >
                    <DialogHeader borderBottom="1px solid rgba(255, 255, 255, 0.1)" pb={5}>
                        <VStack align="flex-start" gap={1}>
                            <Flex align="center" gap={3}>
                                <ExternalLink size={20} color="var(--chakra-colors-text-accent)" />
                                <DialogTitle fontSize="xl">{selectedTask ? getModuleDisplayName(selectedTask.moduleName) : 'Analysis Report'}</DialogTitle>
                            </Flex>
                            {selectedTask && (
                                <Text fontSize="sm" color="text.muted" mt={1}>
                                    {getModuleDescription(selectedTask.moduleName)}
                                </Text>
                            )}
                        </VStack>
                    </DialogHeader>
                    <DialogBody py={6}>
                        <ResultRenderer task={selectedTask} />
                    </DialogBody>
                    <DialogCloseTrigger color="white" />
                </DialogContent>
            </DialogRoot>
        </Box>
    );
};
