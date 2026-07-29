'use client';

import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Lightbulb,
  Star,
  Psychology,
  AutoGraph,
  Balance,
  CheckCircle,
  AttachMoney,
  Timeline,
  SmartToy,
  ThumbUp,
  Bolt,
} from '@mui/icons-material';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import LineChart from '@/components/charts/LineChart';
import AreaChart from '@/components/charts/AreaChart';
import BarChart from '@/components/charts/BarChart';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const predictionLineData = {
  labels: monthLabels,
  datasets: [
    {
      name: 'Actual',
      data: [32500, 38200, 42100, 39800, 45600, 48300, 52400, 49100, 51200, 55800, 58900, 62300],
      color: '#1976d2',
    },
    {
      name: 'Predicted',
      data: [31000, 36500, 40000, 41500, 44000, 47000, 50500, 51000, 53000, 56500, 60000, 64500],
      color: '#d32f2f',
    },
  ],
};

const demandPredictionData = [
  { service: 'Deep Home Cleaning', current: 523, predicted: 610, confidence: 92 },
  { service: 'Emergency Pipe Repair', current: 245, predicted: 310, confidence: 88 },
  { service: 'Carpet Steam Cleaning', current: 312, predicted: 380, confidence: 85 },
  { service: 'Office Deep Cleaning', current: 245, predicted: 295, confidence: 90 },
  { service: 'Refrigerator Repair', current: 178, predicted: 220, confidence: 82 },
  { service: 'Interior Room Painting', current: 156, predicted: 185, confidence: 78 },
  { service: 'Seasonal AC Tune-Up', current: 88, predicted: 145, confidence: 95 },
  { service: 'Local Moving - 2 Bedroom', current: 203, predicted: 240, confidence: 80 },
];

const bookingForecastData = {
  labels: monthLabels,
  datasets: [
    {
      name: 'Forecasted Bookings',
      data: [620, 680, 720, 750, 800, 850, 910, 880, 920, 960, 1000, 1050],
      color: '#7b1fa2',
    },
  ],
};

interface Insight {
  id: string;
  type: 'trend' | 'risk' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: React.ReactElement;
  color: string;
}

const insights: Insight[] = [
  {
    id: 'ins_001',
    type: 'trend',
    title: 'Revenue up 15% this month',
    description:
      'Platform revenue increased by 15% compared to last month, driven primarily by cleaning and plumbing services. The upward trend has been consistent for the past 3 months.',
    impact: 'high',
    icon: <TrendingUp />,
    color: '#388e3c',
  },
  {
    id: 'ins_002',
    type: 'risk',
    title: '3 providers at risk of churn',
    description:
      'Three mid-tier providers have shown declining activity over the past 60 days. BugOff Pest Control, Green Valley Landscaping, and Arctic Air Phoenix may need proactive engagement.',
    impact: 'high',
    icon: <Warning />,
    color: '#d32f2f',
  },
  {
    id: 'ins_003',
    type: 'opportunity',
    title: 'Weekend bookings 40% higher',
    description:
      'Saturday and Sunday bookings are 40% higher than weekday averages. Consider running weekend-specific promotions and increasing provider availability on weekends.',
    impact: 'medium',
    icon: <Lightbulb />,
    color: '#1976d2',
  },
  {
    id: 'ins_004',
    type: 'recommendation',
    title: 'Customer retention improved',
    description:
      'Repeat customer rate improved from 72% to 78% this quarter. The new loyalty program and improved provider matching are key contributors to this improvement.',
    impact: 'medium',
    icon: <ThumbUp />,
    color: '#388e3c',
  },
  {
    id: 'ins_005',
    type: 'trend',
    title: 'New category gaining traction',
    description:
      'Home Security services have seen a 280% increase in bookings over the last quarter. Consider onboarding more security providers and expanding service offerings.',
    impact: 'medium',
    icon: <AutoGraph />,
    color: '#7b1fa2',
  },
  {
    id: 'ins_006',
    type: 'risk',
    title: 'Payment failures increasing',
    description:
      'Payment failure rate increased from 2.1% to 3.8% this month. Stripe retry logic may need review. Investigating potential card expiration and insufficient funds patterns.',
    impact: 'high',
    icon: <Warning />,
    color: '#d32f2f',
  },
];

interface ProviderRecommendation {
  id: string;
  name: string;
  avatar: string;
  score: number;
  matchPercentage: number;
  reasons: string[];
  category: string;
}

const providerRecommendations: ProviderRecommendation[] = [
  {
    id: 'pr_001',
    name: 'SparkleClean Services',
    avatar: 'SC',
    score: 97,
    matchPercentage: 97,
    reasons: [
      'Highest rating (4.9) among cleaning providers',
      'Consistent booking volume growth (+18%)',
      'Zero complaints in the last 90 days',
    ],
    category: 'Cleaning',
  },
  {
    id: 'pr_002',
    name: 'WoodCraft Carpentry',
    avatar: 'WC',
    score: 94,
    matchPercentage: 94,
    reasons: [
      'Premium service tier with high customer satisfaction',
      'Strong repeat booking rate (42%)',
      'Expanding into new service areas',
    ],
    category: 'Carpentry',
  },
  {
    id: 'pr_003',
    name: 'Plumbing Plus NYC',
    avatar: 'PP',
    score: 91,
    matchPercentage: 91,
    reasons: [
      'Market leader in plumbing with 1,280 bookings',
      'Fast average response time (23 minutes)',
      'Verified KYC and full insurance coverage',
    ],
    category: 'Plumbing',
  },
  {
    id: 'pr_004',
    name: 'Bright Spark Electric',
    avatar: 'BS',
    score: 88,
    matchPercentage: 88,
    reasons: [
      '24/7 emergency availability',
      'High conversion rate from views to bookings',
      'Featured provider status with strong reviews',
    ],
    category: 'Electrical',
  },
];

interface ServiceRecommendation {
  id: string;
  title: string;
  potentialRevenue: number;
  confidence: number;
  reason: string;
  category: string;
}

const serviceRecommendations: ServiceRecommendation[] = [
  {
    id: 'sr_001',
    title: 'Smart Home Integration Package',
    potentialRevenue: 28500,
    confidence: 89,
    reason: 'High demand signal from search queries and competitor analysis. 12 providers already offer related services.',
    category: 'Home Security',
  },
  {
    id: 'sr_002',
    title: 'Eco-Friendly Cleaning Bundle',
    potentialRevenue: 18200,
    confidence: 85,
    reason: 'Green cleaning searches up 340% YoY. SparkleClean and GreenScrub are well-positioned to fulfill.',
    category: 'Cleaning',
  },
  {
    id: 'sr_003',
    title: 'Commercial HVAC Maintenance Plans',
    potentialRevenue: 42000,
    confidence: 82,
    reason: 'Recurring revenue model with high LTV. Currently underserved in Chicago and Houston markets.',
    category: 'AC Repair',
  },
  {
    id: 'sr_004',
    title: 'Moving + Cleaning Combo Package',
    potentialRevenue: 15800,
    confidence: 78,
    reason: 'Cross-category bundle opportunity. Moving and cleaning bookings frequently overlap within 7 days.',
    category: 'Moving',
  },
];

export default function AIDashboardPage() {
  const [tabValue, setTabValue] = useState(0);

  const impactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp fontSize="small" />;
      case 'risk':
        return <Warning fontSize="small" />;
      case 'opportunity':
        return <Lightbulb fontSize="small" />;
      case 'recommendation':
        return <ThumbUp fontSize="small" />;
      default:
        return <SmartToy fontSize="small" />;
    }
  };

  const renderPredictionsTab = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#1976d215', color: '#1976d2' }}>
                <Timeline />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Revenue Prediction
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Actual vs predicted revenue for the year
                </Typography>
              </Box>
            </Box>
            <LineChart
              data={predictionLineData}
              height={300}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Chip size="small" label="Solid line: Actual" variant="outlined" />
              <Chip size="small" label="Dashed line: Predicted" variant="outlined" color="error" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#7b1fa215', color: '#7b1fa2' }}>
                <AutoGraph />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Booking Forecast
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Projected booking volumes for the next 12 months
                </Typography>
              </Box>
            </Box>
            <AreaChart
              data={bookingForecastData}
              height={300}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#f57c0015', color: '#f57c00' }}>
                <Balance />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Demand Prediction by Service
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Current vs predicted demand with confidence scores
                </Typography>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Current Bookings
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Predicted Demand
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Growth
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Confidence
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Predicted Bar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demandPredictionData.map((item) => {
                    const growth = ((item.predicted - item.current) / item.current * 100).toFixed(1);
                    return (
                      <TableRow key={item.service}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {item.service}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{item.current}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color="primary">
                            {item.predicted}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`+${growth}%`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            <Typography variant="caption" fontWeight={600}>
                              {item.confidence}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 150 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={item.confidence}
                              sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  bgcolor:
                                    item.confidence >= 90
                                      ? '#388e3c'
                                      : item.confidence >= 80
                                        ? '#1976d2'
                                        : '#f57c00',
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderInsightsTab = () => (
    <Grid container spacing={3}>
      {insights.map((insight) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={insight.id}>
          <Card
            sx={{
              height: '100%',
              borderLeft: `4px solid ${insight.color}`,
              transition: 'all 0.2s',
              '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: `${insight.color}15`,
                    color: insight.color,
                    width: 40,
                    height: 40,
                  }}
                >
                  {typeIcon(insight.type)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Chip
                    label={insight.type}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      bgcolor: `${insight.color}15`,
                      color: insight.color,
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Chip
                  label={insight.impact}
                  size="small"
                  color={impactColor(insight.impact) as any}
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {insight.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {insight.description}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Take Action
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderRecommendationsTab = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Provider Recommendations
        </Typography>
      </Grid>
      {providerRecommendations.map((provider) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={provider.id}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.2s',
              '&:hover': { boxShadow: 4 },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 48,
                    height: 48,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  {provider.avatar}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {provider.name}
                  </Typography>
                  <Chip label={provider.category} size="small" variant="outlined" />
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Match Score
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="primary">
                    {provider.matchPercentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={provider.matchPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor:
                        provider.matchPercentage >= 95
                          ? '#388e3c'
                          : provider.matchPercentage >= 90
                            ? '#1976d2'
                            : '#f57c00',
                    },
                  }}
                />
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {provider.reasons.map((reason, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                    <CheckCircle
                      sx={{ fontSize: 14, color: 'success.main', mt: 0.25, flexShrink: 0 }}
                    />
                    <Typography variant="caption" color="text.secondary" lineHeight={1.4}>
                      {reason}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Service Recommendations
        </Typography>
      </Grid>
      {serviceRecommendations.map((service) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={service.id}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.2s',
              '&:hover': { boxShadow: 4 },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: '#388e3c15',
                    color: '#388e3c',
                    width: 40,
                    height: 40,
                  }}
                >
                  <Bolt />
                </Avatar>
                <Chip label={service.category} size="small" variant="outlined" />
              </Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {service.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5, fontSize: '0.8rem' }}>
                {service.reason}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Potential Revenue
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} color="primary">
                  ${service.potentialRevenue.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Confidence
                </Typography>
                <Chip
                  label={`${service.confidence}%`}
                  size="small"
                  color={service.confidence >= 85 ? 'success' : 'warning'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <AdminLayout>
      <PageHeader
        title="AI Dashboard"
        subtitle="Intelligent insights and predictions"
      />

      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<Psychology />}
            iconPosition="start"
            label="Predictions"
            sx={{ textTransform: 'none', fontWeight: 600, minHeight: 56 }}
          />
          <Tab
            icon={<Lightbulb />}
            iconPosition="start"
            label="Insights"
            sx={{ textTransform: 'none', fontWeight: 600, minHeight: 56 }}
          />
          <Tab
            icon={<Star />}
            iconPosition="start"
            label="Recommendations"
            sx={{ textTransform: 'none', fontWeight: 600, minHeight: 56 }}
          />
        </Tabs>
      </Card>

      {tabValue === 0 && renderPredictionsTab()}
      {tabValue === 1 && renderInsightsTab()}
      {tabValue === 2 && renderRecommendationsTab()}
    </AdminLayout>
  );
}
