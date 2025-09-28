import React, { useState, useEffect, useRef } from 'react';
import './AIAutomationSystem.css';

interface AITask {
  id: string;
  type: 'design_generation' | 'price_optimization' | 'manufacturing_check' | 'market_analysis' | 'customer_matching';
  status: 'pending' | 'processing' | 'completed' | 'error';
  title: string;
  description: string;
  progress: number;
  result?: any;
  createdAt: Date;
  completedAt?: Date;
}

interface AIModel {
  id: string;
  name: string;
  type: 'design' | 'pricing' | 'analysis' | 'prediction' | 'optimization';
  status: 'active' | 'training' | 'offline';
  accuracy: number;
  description: string;
  icon: string;
}

interface DesignSuggestion {
  id: string;
  name: string;
  category: 'ring' | 'necklace' | 'earrings' | 'bracelet' | 'watch' | 'glasses';
  style: string;
  materials: string[];
  estimatedPrice: number;
  marketDemand: number;
  uniquenessScore: number;
  thumbnail: string;
  aiConfidence: number;
}

interface AIAutomationSystemProps {
  onClose?: () => void;
}

const AIAutomationSystem: React.FC<AIAutomationSystemProps> = ({ onClose }) => {
  const [activeTasks, setActiveTasks] = useState<AITask[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([
    {
      id: 'gpt4-designer',
      name: 'GPT-4 Design Creator',
      type: 'design',
      status: 'active',
      accuracy: 94.5,
      description: 'Creates unique jewelry designs from text descriptions',
      icon: '🎨'
    },
    {
      id: 'pricing-optimizer',
      name: 'Price Optimizer Pro',
      type: 'pricing',
      status: 'active',
      accuracy: 97.2,
      description: 'Optimizes pricing based on materials, market trends, and competition',
      icon: '💰'
    },
    {
      id: 'trend-analyzer',
      name: 'Trend Analysis Engine',
      type: 'analysis',
      status: 'active',
      accuracy: 91.8,
      description: 'Analyzes global jewelry trends and predicts future demands',
      icon: '📈'
    },
    {
      id: 'quality-inspector',
      name: 'Quality Inspector AI',
      type: 'analysis',
      status: 'active',
      accuracy: 99.1,
      description: 'Automated quality control and manufacturing feasibility',
      icon: '🔍'
    },
    {
      id: 'customer-matcher',
      name: 'Customer Preference AI',
      type: 'prediction',
      status: 'training',
      accuracy: 88.7,
      description: 'Matches designs to customer preferences and buying patterns',
      icon: '👤'
    },
    {
      id: 'supply-optimizer',
      name: 'Supply Chain Optimizer',
      type: 'optimization',
      status: 'active',
      accuracy: 95.3,
      description: 'Optimizes material sourcing and production scheduling',
      icon: '🏭'
    }
  ]);

  const [designSuggestions, setDesignSuggestions] = useState<DesignSuggestion[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt4-designer');
  const [aiPrompt, setAIPrompt] = useState<string>('');
  const [automationMode, setAutomationMode] = useState<'manual' | 'semi' | 'full'>('semi');
  const [isProcessing, setIsProcessing] = useState(false);

  // AI Chat Interface
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string; timestamp: Date }[]>([
    {
      role: 'ai',
      content: 'Welcome to the AI Automation System! I can help you design jewelry, optimize pricing, analyze trends, and much more. What would you like to create today?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulated AI Processing
  const processAITask = async (taskType: AITask['type'], prompt: string) => {
    const newTask: AITask = {
      id: 'task_' + Date.now(),
      type: taskType,
      status: 'processing',
      title: getTaskTitle(taskType),
      description: prompt,
      progress: 0,
      createdAt: new Date()
    };

    setActiveTasks(prev => [...prev, newTask]);
    setIsProcessing(true);

    // Simulate AI processing with progress updates
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setActiveTasks(prev => prev.map(task =>
        task.id === newTask.id
          ? { ...task, progress: i }
          : task
      ));
    }

    // Complete the task
    const result = await generateAIResult(taskType, prompt);
    setActiveTasks(prev => prev.map(task =>
      task.id === newTask.id
        ? {
            ...task,
            status: 'completed',
            progress: 100,
            result,
            completedAt: new Date()
          }
        : task
    ));

    setIsProcessing(false);
    return result;
  };

  const getTaskTitle = (type: AITask['type']): string => {
    const titles = {
      'design_generation': 'AI Design Generation',
      'price_optimization': 'Price Optimization',
      'manufacturing_check': 'Manufacturing Analysis',
      'market_analysis': 'Market Trend Analysis',
      'customer_matching': 'Customer Preference Matching'
    };
    return titles[type];
  };

  const generateAIResult = async (taskType: AITask['type'], prompt: string) => {
    switch (taskType) {
      case 'design_generation':
        return generateDesignSuggestions(prompt);
      case 'price_optimization':
        return {
          originalPrice: 1250,
          optimizedPrice: 1180,
          savings: 70,
          confidence: 92.5,
          factors: ['Market competition', 'Material costs', 'Demand trends']
        };
      case 'manufacturing_check':
        return {
          feasible: true,
          complexity: 'Medium',
          estimatedTime: '3-5 days',
          costEstimate: 145,
          qualityScore: 94,
          recommendations: ['Use 14k gold for better durability', 'Consider automated setting process']
        };
      case 'market_analysis':
        return {
          trendScore: 87,
          demandForecast: 'Rising',
          competitorAnalysis: 'Medium competition',
          priceRange: '$800-1400',
          targetMarkets: ['Millennials', 'Professional women', 'Gift buyers']
        };
      case 'customer_matching':
        return {
          matchScore: 91,
          targetCustomers: ['Sarah M. (Previous buyer)', 'Jennifer K. (Similar taste)', 'Mike R. (Gift seeker)'],
          marketSegments: ['Luxury seekers', 'Trend followers'],
          conversionProbability: 78
        };
      default:
        return {};
    }
  };

  const generateDesignSuggestions = (prompt: string): DesignSuggestion[] => {
    const categories: DesignSuggestion['category'][] = ['ring', 'necklace', 'earrings', 'bracelet', 'watch', 'glasses'];
    const styles = ['Modern', 'Vintage', 'Minimalist', 'Art Deco', 'Bohemian', 'Classic', 'Contemporary'];
    const materials = [
      ['Gold', 'Diamond'],
      ['Silver', 'Sapphire'],
      ['Platinum', 'Emerald'],
      ['Rose Gold', 'Pearl'],
      ['Titanium', 'Ruby'],
      ['Palladium', 'Topaz']
    ];

    return Array.from({ length: 4 }, (_, i) => ({
      id: `suggestion_${Date.now()}_${i}`,
      name: `AI Generated ${styles[i % styles.length]} ${categories[i % categories.length]}`,
      category: categories[i % categories.length],
      style: styles[i % styles.length],
      materials: materials[i % materials.length],
      estimatedPrice: 500 + Math.random() * 2000,
      marketDemand: 70 + Math.random() * 30,
      uniquenessScore: 80 + Math.random() * 20,
      thumbnail: `https://via.placeholder.com/150x150?text=${categories[i % categories.length]}`,
      aiConfidence: 85 + Math.random() * 15
    }));
  };

  const handleAIChat = async (message: string) => {
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }]);

    setChatInput('');

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse = generateAIResponse(message);
    setChatMessages(prev => [...prev, {
      role: 'ai',
      content: aiResponse,
      timestamp: new Date()
    }]);

    // Auto-scroll to bottom
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('design') || message.includes('create')) {
      processAITask('design_generation', userMessage);
      return "I'll generate some unique design suggestions for you right now. Check the task monitor to see the progress!";
    } else if (message.includes('price') || message.includes('cost')) {
      processAITask('price_optimization', userMessage);
      return "Let me analyze the optimal pricing strategy for your jewelry. This will just take a moment.";
    } else if (message.includes('trend') || message.includes('market')) {
      processAITask('market_analysis', userMessage);
      return "I'm analyzing current market trends and demand patterns. This data will help optimize your design strategy.";
    } else if (message.includes('quality') || message.includes('manufacture')) {
      processAITask('manufacturing_check', userMessage);
      return "Running manufacturing feasibility analysis and quality checks. I'll provide detailed recommendations shortly.";
    } else if (message.includes('customer') || message.includes('buyer')) {
      processAITask('customer_matching', userMessage);
      return "Analyzing customer preferences and matching potential buyers to your designs. This helps maximize sales potential.";
    } else {
      return "I understand you're looking for assistance with jewelry design and business optimization. I can help with: \n\n• AI-powered design generation\n• Intelligent pricing optimization\n• Market trend analysis\n• Manufacturing feasibility\n• Customer preference matching\n\nWhat specific area would you like to explore?";
    }
  };

  const runAutomationWorkflow = async () => {
    if (automationMode === 'full') {
      // Run full automation sequence
      await processAITask('market_analysis', 'Analyze current trends');
      await processAITask('design_generation', 'Create trending designs');
      await processAITask('price_optimization', 'Optimize pricing');
      await processAITask('manufacturing_check', 'Verify manufacturability');
      await processAITask('customer_matching', 'Match to customers');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="ai-automation-system">
      {onClose && (
        <button
          className="close-button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          ×
        </button>
      )}
      <div className="ai-header">
        <h2>AI Automation System</h2>
        <p>The Intelligence That Makes MatrixGold Look Ancient</p>

        <div className="automation-controls">
          <div className="mode-selector">
            <label>Automation Mode:</label>
            <select
              value={automationMode}
              onChange={(e) => setAutomationMode(e.target.value as any)}
            >
              <option value="manual">Manual</option>
              <option value="semi">Semi-Automated</option>
              <option value="full">Full AI Automation</option>
            </select>
          </div>

          <button
            className="run-automation"
            onClick={runAutomationWorkflow}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Run Automation'}
          </button>
        </div>
      </div>

      <div className="ai-workspace">
        {/* AI Models Status */}
        <div className="ai-models-panel">
          <h3>AI Models Status</h3>
          <div className="models-grid">
            {aiModels.map(model => (
              <div key={model.id} className={`model-card ${model.status}`}>
                <div className="model-icon">{model.icon}</div>
                <div className="model-info">
                  <div className="model-name">{model.name}</div>
                  <div className="model-type">{model.type.charAt(0).toUpperCase() + model.type.slice(1)}</div>
                  <div className="model-accuracy">{model.accuracy}% accuracy</div>
                  <div className={`model-status ${model.status}`}>
                    {model.status === 'active' ? '🟢 Active' :
                     model.status === 'training' ? '🟡 Training' : '🔴 Offline'}
                  </div>
                </div>
                <div className="model-description">{model.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="ai-chat-panel">
          <h3>AI Assistant</h3>
          <div className="chat-messages">
            {chatMessages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">{message.content}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask AI to design, analyze, optimize..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && chatInput.trim() && handleAIChat(chatInput)}
            />
            <button
              onClick={() => chatInput.trim() && handleAIChat(chatInput)}
              disabled={!chatInput.trim()}
            >
              Send
            </button>
          </div>
        </div>

        {/* Task Monitor */}
        <div className="task-monitor-panel">
          <h3>Active AI Tasks</h3>
          <div className="tasks-list">
            {activeTasks.length === 0 ? (
              <div className="no-tasks">No active tasks. Start a conversation with AI to begin!</div>
            ) : (
              activeTasks.slice(-5).reverse().map(task => (
                <div key={task.id} className={`task-card ${task.status}`}>
                  <div className="task-header">
                    <div className="task-title">{task.title}</div>
                    <div className={`task-status ${task.status}`}>
                      {task.status === 'processing' ? '⏳' :
                       task.status === 'completed' ? '✅' :
                       task.status === 'error' ? '❌' : '⏸️'}
                    </div>
                  </div>

                  <div className="task-description">{task.description}</div>

                  {task.status === 'processing' && (
                    <div className="task-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <div className="progress-text">{task.progress}%</div>
                    </div>
                  )}

                  {task.status === 'completed' && task.result && (
                    <div className="task-result">
                      <strong>Result:</strong>
                      {typeof task.result === 'object' ? (
                        <pre>{JSON.stringify(task.result, null, 2)}</pre>
                      ) : (
                        <span>{task.result}</span>
                      )}
                    </div>
                  )}

                  <div className="task-time">
                    Started: {task.createdAt.toLocaleTimeString()}
                    {task.completedAt && (
                      <span> • Completed: {task.completedAt.toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI-Generated Design Suggestions */}
      {designSuggestions.length > 0 && (
        <div className="design-suggestions-panel">
          <h3>AI-Generated Design Suggestions</h3>
          <div className="suggestions-grid">
            {designSuggestions.map(suggestion => (
              <div key={suggestion.id} className="suggestion-card">
                <div className="suggestion-thumbnail">
                  <img src={suggestion.thumbnail} alt={suggestion.name} />
                  <div className="confidence-badge">
                    AI: {Math.round(suggestion.aiConfidence)}%
                  </div>
                </div>

                <div className="suggestion-info">
                  <div className="suggestion-name">{suggestion.name}</div>
                  <div className="suggestion-category">{suggestion.category}</div>
                  <div className="suggestion-style">{suggestion.style} Style</div>
                  <div className="suggestion-materials">
                    {suggestion.materials.join(', ')}
                  </div>

                  <div className="suggestion-metrics">
                    <div className="metric">
                      <span>Price: ${Math.round(suggestion.estimatedPrice)}</span>
                    </div>
                    <div className="metric">
                      <span>Demand: {Math.round(suggestion.marketDemand)}%</span>
                    </div>
                    <div className="metric">
                      <span>Unique: {Math.round(suggestion.uniquenessScore)}%</span>
                    </div>
                  </div>

                  <div className="suggestion-actions">
                    <button className="refine-btn">Refine Design</button>
                    <button className="create-btn">Create 3D Model</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Performance Analytics */}
      <div className="ai-analytics-panel">
        <h3>AI Performance Analytics</h3>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-title">Designs Generated</div>
            <div className="analytics-value">2,847</div>
            <div className="analytics-change">+23% this week</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-title">Average Accuracy</div>
            <div className="analytics-value">94.2%</div>
            <div className="analytics-change">+1.5% improvement</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-title">Cost Savings</div>
            <div className="analytics-value">$18,650</div>
            <div className="analytics-change">Through optimization</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-title">Time Saved</div>
            <div className="analytics-value">156 hours</div>
            <div className="analytics-change">This month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAutomationSystem;
