import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Filter, Wand2 } from 'lucide-react';

/**
 * RecommendationCard - Individual AI recommendation
 */
const RecommendationCard = ({ recommendation, index }) => {
  const [checkedSteps, setCheckedSteps] = useState({});

  const priorityColors = {
    'high': { bg: 'rgba(248, 113, 113, 0.1)', badge: '#F87171' },
    'medium': { bg: 'rgba(251, 191, 36, 0.1)', badge: '#FBBF24' },
    'low': { bg: 'rgba(96, 165, 250, 0.1)', badge: '#60A5FA' }
  };

  const categoryColors = {
    'bidding': '#4F8EF7',
    'keywords': '#60A5FA',
    'ad_copy': '#A78BFA',
    'budget': '#34D399',
    'targeting': '#10B981',
    'quality_score': '#FBBF24',
    'structure': '#FB923C'
  };

  const colors = priorityColors[recommendation.priority] || priorityColors.low;

  const toggleStep = (idx) => {
    setCheckedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-6 rounded-lg border"
      style={{
        background: colors.bg,
        borderColor: colors.badge,
        borderLeftWidth: '4px'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold uppercase"
              style={{
                background: colors.badge,
                color: 'white'
              }}
            >
              {recommendation.priority}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: categoryColors[recommendation.category] + '20',
                color: categoryColors[recommendation.category]
              }}
            >
              {recommendation.category.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {recommendation.title}
          </h3>
        </div>
        <Wand2
          className="w-5 h-5 flex-shrink-0"
          style={{ color: 'var(--color-accent-purple)' }}
        />
      </div>

      {/* Description */}
      <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mb-4 leading-relaxed">
        {recommendation.description}
      </p>

      {/* Expected Impact */}
      <div className="flex items-start gap-2 mb-4 p-3 rounded" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <Star className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-accent-purple)' }} />
        <div>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium">
            EXPECTED IMPACT
          </p>
          <p style={{ color: 'var(--color-text-primary)' }} className="text-sm italic font-medium">
            {recommendation.expectedImpact}
          </p>
        </div>
      </div>

      {/* Action Steps */}
      <div className="mb-4">
        <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium mb-3 uppercase">
          Action Steps
        </p>
        <div className="space-y-2">
          {recommendation.actionSteps?.map((step, idx) => (
            <button
              key={idx}
              onClick={() => toggleStep(idx)}
              className="w-full flex items-start gap-3 p-2 rounded transition-all text-left hover:bg-[rgba(0,0,0,0.05)]"
            >
              <div
                className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={{
                  borderColor: colors.badge,
                  background: checkedSteps[idx] ? colors.badge : 'transparent'
                }}
              >
                {checkedSteps[idx] && (
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'white' }} />
                )}
              </div>
              <span
                className="text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                  textDecoration: checkedSteps[idx] ? 'line-through' : 'none'
                }}
              >
                {step}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Related Flags */}
      {recommendation.relatedFlags && recommendation.relatedFlags.length > 0 && (
        <div className="pt-4 border-t" style={{ borderTopColor: colors.badge }}>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium mb-2">
            ADDRESSES
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendation.relatedFlags.map((flag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: colors.bg,
                  color: colors.badge,
                  border: `1px solid ${colors.badge}`
                }}
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * RecommendationsTab - AI-powered recommendations from Gemini
 */
export const RecommendationsTab = ({ recommendations = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(recommendations.map(r => r.category))];

  // Filter recommendations
  const filtered = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(r => r.category === selectedCategory);

  // Sort by priority
  const sorted = [...filtered].sort((a, b) => {
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });

  if (!recommendations || recommendations.length === 0) {
    return (
      <div
        className="p-12 rounded-lg border text-center"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(167, 139, 250, 0.1)' }}
          >
            <Wand2 className="w-8 h-8" style={{ color: 'var(--color-accent-purple)' }} />
          </div>
        </div>
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          No recommendations available
        </p>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Powered by Gemini AI · Recommendations will appear once analysis is complete
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gemini Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            AI Recommendations
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mt-1">
            {sorted.length} actionable recommendation{sorted.length !== 1 ? 's' : ''} from Gemini
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1"
          style={{
            background: 'rgba(167, 139, 250, 0.1)',
            color: 'var(--color-accent-purple)'
          }}
        >
          <Wand2 className="w-3.5 h-3.5" />
          Powered by Gemini AI
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className="px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium"
            style={{
              background: selectedCategory === category
                ? 'var(--color-accent-primary)'
                : 'var(--color-bg-secondary)',
              color: selectedCategory === category ? 'white' : 'var(--color-text-secondary)',
              border: selectedCategory === category ? 'none' : `1px solid var(--color-border)`
            }}
          >
            {category === 'all' ? 'All' : category.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {sorted.map((rec, idx) => (
          <RecommendationCard key={idx} recommendation={rec} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsTab;
