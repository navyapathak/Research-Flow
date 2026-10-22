import { DocumentItem } from '../types';

export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-attention-2017',
    title: 'Attention Is All You Need',
    fileName: 'vaswani2017_attention.pdf',
    fileType: 'pdf',
    fileSize: 2211840, // ~2.1 MB
    uploadDate: '2026-09-15T10:30:00Z',
    status: 'ready',
    pagesCount: 5,
    summary:
      'Proposes the Transformer, a novel neural network architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Achieves superior translation quality (28.4 BLEU on WMT 2014 En-De) while being significantly more parallelizable and faster to train.',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
    publicationDate: 'December 2017',
    journalOrSource: 'NeurIPS 2017 (Advances in Neural Information Processing Systems)',
    tags: ['Machine Learning', 'Transformers', 'NLP', 'Deep Learning'],
    pages: [
      {
        pageNumber: 1,
        textContent: `Attention Is All You Need

Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.

1 Introduction
Recurrent neural networks, particularly long short-term memory (LSTM) and gated recurrent (GRU) neural networks, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples. Recent work has achieved significant improvements in computational efficiency through factorization tricks and conditional computation, while also improving model performance in case of the latter. The fundamental constraint of sequential computation, however, remains.

Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences. In all but a few cases, however, such attention mechanisms are used in conjunction with a recurrent network. In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.`,
        sections: [
          {
            id: 'sec-1-1',
            title: 'Abstract & BLEU Scores',
            pageNumber: 1,
            preview: 'Achieves 28.4 BLEU on WMT 2014 English-to-German and 41.8 BLEU on English-to-French after 3.5 days on 8 GPUs.'
          },
          {
            id: 'sec-1-2',
            title: '1. Introduction: The Sequential Bottleneck',
            pageNumber: 1,
            preview: 'Recurrent models inherently preclude parallelization due to hidden state dependence across sequential time steps.'
          }
        ]
      },
      {
        pageNumber: 2,
        textContent: `3 Model Architecture

Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations (x_1, ..., x_n) to a sequence of continuous representations z = (z_1, ..., z_n). Given z, the decoder then generates an output sequence (y_1, ..., y_m) of symbols one element at a time. At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next.

The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves of Figure 1, respectively.

3.1 Encoder and Decoder Stacks
Encoder: The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization. That is, the output of each sub-layer is LayerNorm(x + Sublayer(x)), where Sublayer(x) is the function implemented by the sub-layer itself. To facilitate these residual connections, all sub-layers in the model, as well as the embedding layers, produce outputs of dimension d_model = 512.

Decoder: The decoder is also composed of a stack of N = 6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack. Similar to the encoder, we employ residual connections around each of the sub-layers, followed by layer normalization. We also modify the self-attention sub-layer in the decoder stack to prevent positions from attending to subsequent positions. This masking, combined with fact that the output embeddings are offset by one position, ensures that the predictions for position i can depend only on the known outputs at positions less than i.

3.2 Attention
An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.

3.2.1 Scaled Dot-Product Attention
We call our particular attention "Scaled Dot-Product Attention". The input consists of queries and keys of dimension d_k, and values of dimension d_v. We compute the dot products of the query with all keys, divide each by sqrt(d_k), and apply a softmax function to obtain the weights on the values.
In practice, we compute the attention function on a set of queries simultaneously, packed together into a matrix Q. The keys and values are also packed into matrices K and V. We compute the matrix of outputs as:

Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V

The two most commonly used attention functions are additive attention, and dot-product (multiplicative) attention. Dot-product attention is identical to our algorithm, except for the scaling factor of 1 / sqrt(d_k). Additive attention computes the compatibility function using a feed-forward network with a single hidden layer. While the two are similar in theoretical complexity, dot-product attention is much faster and more space-efficient in practice, since it can be implemented using highly optimized matrix multiplication code.
We suspect that for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by 1 / sqrt(d_k).`,
        sections: [
          {
            id: 'sec-2-1',
            title: '3.1 Encoder and Decoder Stacks (N=6 Layers, d_model=512)',
            pageNumber: 2,
            preview: 'LayerNorm(x + Sublayer(x)) with 6 identical layers and dimension 512.'
          },
          {
            id: 'sec-2-2',
            title: '3.2.1 Scaled Dot-Product Attention Equation',
            pageNumber: 2,
            preview: 'Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V with scaling factor to avoid vanishing gradients.'
          }
        ]
      },
      {
        pageNumber: 3,
        textContent: `3.2.2 Multi-Head Attention
Instead of performing a single attention function with d_model-dimensional queries, keys and values, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to d_k, d_k and d_v dimensions, respectively. On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding d_v-dimensional output values. These are concatenated and once again projected, resulting in the final values.

Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.

MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W^O
where head_i = Attention(Q * W_i^Q, K * W_i^K, V * W_i^V)

Where the projections are parameter matrices W_i^Q in R^{d_model x d_k}, W_i^K in R^{d_model x d_k}, W_i^V in R^{d_model x d_v} and W^O in R^{h*d_v x d_model}.
In this work we employ h = 8 parallel attention layers, or heads. For each of these we use d_k = d_v = d_model / h = 64. Due to the reduced dimension of each head, the total computational cost is similar to that of single-head attention with full dimensionality.

3.3 Position-wise Feed-Forward Networks
In addition to attention sub-layers, each of the layers in our encoder and decoder contains a fully connected feed-forward network, which is applied to each position separately and identically. This consists of two linear transformations with a ReLU activation in between:
FFN(x) = max(0, x * W_1 + b_1) * W_2 + b_2
While the linear transformations are identical across different positions, they use different parameters from layer to layer. Another way of describing this is as two convolutions with kernel size 1. The dimensionality of input and output is d_model = 512, and the inner-layer has dimensionality d_ff = 2048.

3.5 Positional Encoding
Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute positions of the tokens in the sequence. To this end, we add "positional encodings" to the input embeddings at the bottoms of the encoder and decoder stacks. The positional encodings have the same dimension d_model as the embeddings, so that the two can be summed. There are many choices of positional encodings, learned and fixed.
In this work, we use sine and cosine functions of different frequencies:
PE_{(pos, 2i)} = sin(pos / 10000^{2i / d_model})
PE_{(pos, 2i+1)} = cos(pos / 10000^{2i / d_model})
where pos is the position and i is the dimension. That is, each dimension of the positional encoding corresponds to a sinusoid. The wavelengths form a geometric progression from 2*pi to 10000 * 2*pi. We chose this version because we hypothesized it would allow the model to easily learn to attend by relative positions, since for any fixed offset k, PE_{pos+k} can be represented as a linear function of PE_{pos}.`,
        sections: [
          {
            id: 'sec-3-1',
            title: '3.2.2 Multi-Head Attention (h=8 heads, d_k=64)',
            pageNumber: 3,
            preview: 'Parallel linear projections to capture information from multiple representation subspaces simultaneously.'
          },
          {
            id: 'sec-3-2',
            title: '3.5 Sinusoidal Positional Encoding',
            pageNumber: 3,
            preview: 'Trigonometric sine/cosine encoding allows the model to extrapolate sequence positions without recurrence.'
          }
        ]
      },
      {
        pageNumber: 4,
        textContent: `4 Why Self-Attention

In this section we compare various aspects of self-attention layers to the recurrent and convolutional layers commonly used for mapping one variable-length sequence of symbol representations (x_1, ..., x_n) to another sequence of equal length (z_1, ..., z_n), such as a hidden layer in a typical sequence transduction encoder or decoder. Motivating our use of self-attention we consider three desiderata.

One is the total computational complexity per layer. Another is the amount of computation that can be parallelized, as measured by the minimum number of sequential operations required.
The third is the path length between long-range dependencies in the network. Learning long-range dependencies is a key challenge in many sequence transduction tasks. One key factor affecting the ability to learn such dependencies is the length of the paths forward and backward signals have to traverse in the network. The shorter these paths between any combination of positions in the input and output sequences, the easier it is to learn long-range dependencies. Hence we also compare the maximum path length between any two input and output positions in networks composed of the different layer types.

Table 1: Maximum path lengths, per-layer complexity and minimum number of sequential operations for different layer types.
Layer Type            | Complexity per Layer | Sequential Operations | Maximum Path Length
Self-Attention        | O(n^2 * d)            | O(1)                   | O(1)
Recurrent             | O(n * d^2)            | O(n)                   | O(n)
Convolutional         | O(k * n * d^2)        | O(1)                   | O(log_k(n))
Self-Attention (restr)| O(r * n * d)          | O(1)                   | O(n/r)

As noted in Table 1, a self-attention layer connects all positions with a constant number of sequentially executed operations, whereas a recurrent layer requires O(n) sequential operations. In terms of computational complexity, self-attention layers are faster than recurrent layers when the sequence length n is smaller than the representation dimensionality d, which is often the case with sentence representations used in state of the art models in machine translation, such as word-piece and byte-pair representations.

5 Training
5.1 Training Data and Batching
We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37000 tokens. For English-French, we used the significantly larger WMT 2014 English-French dataset consisting of 36 million sentences and split tokens into a 32000 word-piece vocabulary. Sentence pairs were batched together by approximate sequence length. Each training batch contained a set of sentence pairs containing approximately 25000 source tokens and 25000 target tokens.

5.2 Hardware and Schedule
We trained our models on one machine with 8 NVIDIA P100 GPUs. For our base models using the hyperparameters described throughout the paper, each training step took about 0.4 seconds. We trained the base models for a total of 100,000 steps or 12 hours. For our big models (described on the bottom line of table 3), step time was 1.0 seconds. The big models were trained for 300,000 steps (3.5 days).

5.3 Optimizer
We used the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^-9. We varied the learning rate over the course of training, according to the formula:
lrate = d_model^{-0.5} * min(step_num^{-0.5}, step_num * warmup_steps^{-1.5})
This corresponds to increasing the learning rate linearly for the first warmup_steps = 4000 training steps, and decreasing it thereafter proportionally to the inverse square root of the step number.

5.4 Regularization
Residual Dropout: We apply dropout to the output of each sub-layer, before it is added to the sub-layer input and normalized. We use a rate of P_drop = 0.1.
Label Smoothing: During training, we employed label smoothing of value epsilon_ls = 0.1. This hurts perplexity, as the model learns to be more unsure, but improves accuracy and BLEU score.`,
        sections: [
          {
            id: 'sec-4-1',
            title: '4. Computational Complexity: Self-Attention vs Recurrent',
            pageNumber: 4,
            preview: 'Self-Attention achieves O(1) sequential operations and O(1) path length vs O(n) in RNNs.'
          },
          {
            id: 'sec-4-2',
            title: '5. Training Setup: Adam Optimizer & Label Smoothing',
            pageNumber: 4,
            preview: 'Warmup steps of 4000, 8x NVIDIA P100 GPUs, label smoothing epsilon=0.1 improving BLEU.'
          }
        ]
      },
      {
        pageNumber: 5,
        textContent: `6 Results
6.1 Machine Translation
On the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big) in Table 2) outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4. The configuration of this model is listed in the bottom line of Table 3. Training took 3.5 days on 8 P100 GPUs. Even our base model surpasses all previously published models and ensembles, at a fraction of the training cost of any of the competitive models.

On the WMT 2014 English-to-French translation task, our big model achieves a BLEU score of 41.0, outperforming all previously reported single models, at less than 1/4 the training cost of the previous state-of-the-art model. The Transformer (big) model trained for English-to-French used dropout rate P_drop = 0.1, rather than 0.3.

Table 2: The Transformer achieves better BLEU scores than previous state-of-the-art models on the English-to-German and English-to-French newstest2014 tests at a fraction of the training cost.
Model                              | EN-DE BLEU | EN-FR BLEU | Training Cost (FLOPs)
ByteNet                            | 23.75      | -          | -
Deep-Att + PosUnk                  | -          | 39.2       | 1.0 * 10^20
GNMT + RL                          | 24.6       | 39.92      | 2.3 * 10^19
ConvS2S                            | 25.16      | 40.46      | 9.6 * 10^18
Transformer (base model)           | 27.3       | 38.1       | 3.3 * 10^18
Transformer (big)                  | 28.4       | 41.8       | 2.3 * 10^19

6.2 Model Variations
To evaluate the importance of different components of the Transformer, we varied our base model in different ways, measuring changes in performance on English-to-German translation on the development set, newstest2013. We varied the number of attention heads and the attention key and value dimensions, keeping the amount of computation constant. While single-head attention is 0.9 BLEU worse than the best setting, quality also drops with too many heads.

7 Conclusion
In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention.
For translation tasks, the Transformer can be trained significantly faster than architectures based on recurrent or convolutional layers. On both WMT 2014 English-to-German and WMT 2014 English-to-French translation tasks, we achieve a new state of the art. In the former task our best model out-performs even all previously reported ensembles.
We are excited about the future of attention-based models and plan to apply them to other tasks. We plan to extend the Transformer to problems involving input and output modalities other than text and to investigate local, restricted attention mechanisms to efficiently handle large inputs and outputs such as images, audio and video. Making generation less sequential is another research goal of ours.`,
        sections: [
          {
            id: 'sec-5-1',
            title: '6.1 Benchmark Results: Table 2 Comparison',
            pageNumber: 5,
            preview: 'Transformer (big) achieves 28.4 EN-DE and 41.8 EN-FR, setting new SOTA at 2.3 * 10^19 FLOPs.'
          },
          {
            id: 'sec-5-2',
            title: '7. Conclusion & Multimodal Outlook',
            pageNumber: 5,
            preview: 'Authors foresee expanding attention to images, audio, video and restricted attention mechanisms.'
          }
        ]
      }
    ]
  },
  {
    id: 'doc-climate-2024',
    title: 'State of Global Climate Action 2024: Energy Transition & Industrial Decarbonization',
    fileName: 'wri2024_climate_action_report.pdf',
    fileType: 'pdf',
    fileSize: 3840000, // ~3.8 MB
    uploadDate: '2026-10-02T14:15:00Z',
    status: 'ready',
    pagesCount: 4,
    summary:
      'A comprehensive synthesis of global progress across energy, industrial decarbonization, and climate finance. Evaluates 42 indicators against 2030 targets required to limit global warming to 1.5°C under the Paris Agreement. Notes unprecedented renewable growth alongside stubborn transmission bottlenecks and industrial financing gaps.',
    authors: 'Sophie Boehm, Clea Schumer, Kelly Levin, Louise Jeffery, Joel Jaeger (World Resources Institute & Climate Analytics)',
    publicationDate: 'November 2024',
    journalOrSource: 'Systems Change Lab & World Resources Institute Special Report',
    tags: ['Climate Change', 'Energy Transition', 'Public Policy', 'Decarbonization'],
    pages: [
      {
        pageNumber: 1,
        textContent: `State of Global Climate Action 2024: Systems Change Under Pressure

Executive Summary
The window to limit global warming to 1.5°C above pre-industrial levels is narrowing rapidly. According to the IPCC Sixth Assessment Report and updated global carbon budget accounting, the remaining global carbon budget from the beginning of 2024 is approximately 250 billion tonnes of CO2 (GtCO2). At current global emission rates of approximately 40 GtCO2 per year from fossil fuel combustion and industrial processes, this budget will be fully exhausted before 2030 unless deep, immediate emission reductions are enacted across all economic sectors.

Out of 42 indicators of systems change monitored in this report across power, buildings, industry, transport, forests, and finance, only 1 indicator—the share of electric vehicles in passenger car sales—is currently on track to meet its 2030 benchmark. Six indicators are heading in the right direction at a promising but insufficient pace, 24 are well off track, and 6 are heading in entirely the wrong direction (including public financing for fossil fuel exploration and deforestation rates in tropical moist forests).

Global Greenhouse Gas Trajectories
To maintain a 50% probability of staying below 1.5°C without significant overshoot, global net anthropogenic GHG emissions must decline by 43% by 2030 relative to 2019 levels, and reach net-zero by approximately 2050. Revised Nationally Determined Contributions (NDCs) submitted prior to COP29 currently imply an emissions reduction of only 2% to 8% by 2030, leaving an alarming ambition gap of 19 to 24 GtCO2e annually by 2030.`,
        sections: [
          {
            id: 'sec-clim-1-1',
            title: 'Remaining Carbon Budget (~250 GtCO2)',
            pageNumber: 1,
            preview: 'Remaining 1.5°C carbon budget is ~250 GtCO2, facing exhaustion within 6 years at 40 GtCO2/year.'
          },
          {
            id: 'sec-clim-1-2',
            title: '42 Indicators Benchmark Summary',
            pageNumber: 1,
            preview: 'Only 1 out of 42 indicators (EV passenger car sales) is currently on track for 2030.'
          }
        ]
      },
      {
        pageNumber: 2,
        textContent: `Section 2: The Power Sector Revolution and Grid Realities

2.1 Renewable Energy Growth
Solar photovoltaic (PV) and onshore wind additions shattered historical records in 2023 and 2024. Worldwide, 510 gigawatts (GW) of renewable capacity was commissioned in 2023, representing a 50% year-over-year increase over 2022 additions. China accounted for nearly 60% of new global renewable installations, deploying more solar PV in 2023 than the entire world installed in 2022.

Global generation from zero-carbon sources reached 39% of total electricity generation in 2023. Solar and wind combined provided 13.4% of total power. To reach the global goal agreed at COP28 of tripling renewable energy capacity to at least 11,000 GW by 2030, annual additions must accelerate to an average of 1,000 GW per year between 2025 and 2030.

2.2 The Grid Bottleneck and Interconnection Queues
The primary bottleneck confronting renewable deployment has shifted decisively from equipment manufacturing and levelized cost of energy (LCOE) to electricity grid integration. Over 3,000 GW of renewable generation projects are currently stalled in grid interconnection queues across the United States, the European Union, Brazil, and India. In the United States alone, the average wait time for an interconnection study has lengthened from 2.1 years in 2008 to over 5.4 years in 2024.

Global annual grid investment must double from approximately $330 billion per year today to at least $680 billion annually by 2030 to accommodate intermittent generation, high-voltage direct current (HVDC) transmission lines, and utility-scale battery energy storage systems (BESS).

2.3 Geographic Financing Disparities
Clean energy investment remains acutely skewed geographically. Despite harboring 20% of the global population and some of the highest solar irradiance on Earth, Sub-Saharan Africa received less than 2% of the $1.8 trillion invested globally in clean energy technologies in 2023. High perceived sovereign risk, foreign exchange volatility, and average cost of capital between 12% and 18% (compared to 3% to 5% in OECD nations) severely suppress private capital mobilization in the Global South.`,
        sections: [
          {
            id: 'sec-clim-2-1',
            title: '2.1 Record Renewable Additions (510 GW in 2023)',
            pageNumber: 2,
            preview: 'Tripling goal requires annual installations to reach 1,000 GW/year through 2030.'
          },
          {
            id: 'sec-clim-2-2',
            title: '2.2 Grid Interconnection Delays (3,000 GW stalled)',
            pageNumber: 2,
            preview: 'US queue wait times increased from 2.1 years to 5.4 years; grid investments must double to $680B/yr.'
          }
        ]
      },
      {
        pageNumber: 3,
        textContent: `Section 3: Heavy Industry and Deep Decarbonization

3.1 Hard-to-Abate Sectors
Heavy industry—primarily crude steel, cement and clinker, and basic chemical synthesis—accounts for roughly 25% of global energy-related CO2 emissions. Unlike light manufacturing and passenger transport, where direct electrification offers ready pathways, high-temperature heat (>1,000°C) and process emissions (such as limestone calcination in cement clinker production) require specialized technological interventions.

3.2 Near-Zero Emission Steel
Primary steel production via blast furnace-basic oxygen furnace (BF-BOF) generates approximately 1.8 to 2.2 tonnes of CO2 per tonne of crude steel. Transitioning to direct reduced iron (DRI) coupled with electric arc furnaces (EAF) utilizing green hydrogen can eliminate up to 95% of direct process emissions. However, commercial adoption remains constrained by green hydrogen costs. Green hydrogen produced via water electrolysis currently costs between $4.00 and $6.50 per kilogram in most markets, whereas parity with fossil methane-derived gray hydrogen requires delivered costs below $1.50 to $2.00 per kilogram.

As of Q3 2024, only 14 commercial-scale green hydrogen-DRI plants have reached final investment decision (FID) globally, representing less than 4% of planned capacity through 2030.

3.3 Cement and Clinker Alternatives
Cement manufacturing produces 0.6 to 0.8 tonnes of CO2 per tonne of cement, with over 60% stemming from chemical release during calcium carbonate decomposition (CaCO3 -> CaO + CO2). Clinker substitution using calcined clay (LC3 technology) has demonstrated 30% to 40% emission reductions at cost parity. However, full deep decarbonization requires either carbon capture, utilization, and storage (CCUS) or novel alkali-activated binder systems currently at Technology Readiness Level (TRL) 6 to 7.`,
        sections: [
          {
            id: 'sec-clim-3-1',
            title: '3.2 Near-Zero Steel & Green Hydrogen Parity ($1.50/kg target)',
            pageNumber: 3,
            preview: 'Green hydrogen costs $4-6.50/kg; only 14 commercial green DRI steel projects reached FID.'
          },
          {
            id: 'sec-clim-3-2',
            title: '3.3 Cement Process Emissions and LC3 Technology',
            pageNumber: 3,
            preview: 'Over 60% of cement emissions are stoichiometric calcination, requiring CCUS or LC3 calcined clay.'
          }
        ]
      },
      {
        pageNumber: 4,
        textContent: `Section 4: Policy Levers, Carbon Border Adjustments, and Recommendations

4.1 Carbon Pricing Mechanisms and CBAM
Explicit carbon pricing systems now cover approximately 24% of global greenhouse gas emissions across 75 carbon taxes and emissions trading systems (ETS). The European Union Emissions Trading System (EU ETS) traded at an average price of €65 to €85 per tonne of CO2 in 2024. The transitional phase of the EU Carbon Border Adjustment Mechanism (CBAM), inaugurated in October 2023, has begun mandating embedded emissions reporting for imports of iron, steel, cement, aluminum, fertilizers, electricity, and hydrogen.

CBAM will phase in direct financial liability between 2026 and 2034, creating strong economic pressure for industrial exporters in Turkey, India, and China to deploy zero-carbon manufacturing technologies to avoid border tariffs.

4.2 Phasing Out Unabated Fossil Subsidies
Total explicit and implicit subsidies for fossil fuels surged to an all-time record of $1.3 trillion in 2022 amid the global energy crisis, before moderating slightly in 2023. Reallocating just 20% of these subsidies toward clean energy transmission infrastructure and de-risking mechanisms in developing economies would bridge the international climate finance gap identified in Article 9 of the Paris Agreement.

Key Recommendations for 2025-2030:
1. Streamline Transmission Permitting: Mandate maximum 24-month statutory review times for critical HVDC grid corridors.
2. Reform Multilateral Development Bank (MDB) Balance Sheets: Increase blended concessional finance five-fold to lower the cost of capital in emerging economies from >12% to below 6%.
3. Enact Mandatory Public Procurement Standards: Government purchasing of green steel and low-carbon cement can guarantee initial off-take for first-mover industrial facilities.
4. Scale Long-Duration Energy Storage: Expand grid-scale storage targets to exceed 400 GW globally by 2030 to ensure grid reliability.`,
        sections: [
          {
            id: 'sec-clim-4-1',
            title: '4.1 Carbon Pricing and EU CBAM Enforcement (2026-2034)',
            pageNumber: 4,
            preview: 'CBAM mandates reporting on embedded emissions and phases in financial tariffs starting 2026.'
          },
          {
            id: 'sec-clim-4-2',
            title: 'Key Recommendations: Transmission & MDB Blended Finance',
            pageNumber: 4,
            preview: 'Cut transmission permitting to 24 months and lower Global South capital cost from 12% to 6%.'
          }
        ]
      }
    ]
  },
  {
    id: 'doc-crispr-2024',
    title: 'CRISPR-Cas9 Therapeutic Horizons: Off-Target Mitigations and In Vivo Delivery Systems',
    fileName: 'nature_med2024_crispr_therapeutics.pdf',
    fileType: 'pdf',
    fileSize: 3145728, // ~3.0 MB
    uploadDate: '2026-10-12T09:00:00Z',
    status: 'ready',
    pagesCount: 4,
    summary:
      'A landmark review on clinical translation of CRISPR-Cas genome editing. Evaluates high-fidelity engineered Cas9 nucleases (SpCas9-HF1, HiFi Cas9), non-viral lipid nanoparticle (LNP) delivery pipelines, off-target detection methods (GUIDE-seq, circularization assays), and long-term immunogenicity.',
    authors: 'Dr. Elena Rostova, Marcus Vance, Sun-Woo Park, Jennifer Doudna-Collaborative Group',
    publicationDate: 'March 2024',
    journalOrSource: 'Nature Medicine Reviews (Vol. 30, Issue 3)',
    tags: ['Biotechnology', 'Gene Editing', 'Medicine', 'CRISPR'],
    pages: [
      {
        pageNumber: 1,
        textContent: `CRISPR-Cas9 Therapeutic Horizons: Off-Target Mitigations and In Vivo Delivery Systems

Abstract
The clinical translation of CRISPR-Cas systems has achieved historic milestones, exemplified by the commercial approval of exagamglogene autotemcel (exa-cel / Casgevy) for transfusion-dependent beta-thalassemia and severe sickle cell disease. Exa-cel utilizes ex vivo electroporation of patient-derived CD34+ hematopoietic stem and progenitor cells (HSPCs) to disrupt the erythroid-specific enhancer of the BCL11A gene, thereby reactivating fetal hemoglobin (HbF) synthesis. While ex vivo therapies have established initial safety and efficacy, realizing the broader curative promise of CRISPR across monogenic and polygenic conditions demands direct in vivo administration. This review examines the two principal scientific frontiers governing in vivo clinical translation: (1) high-fidelity engineering to eliminate off-target double-stranded breaks, and (2) tissue-specific delivery platforms that bypass hepatic tropism.

1 Introduction and Clinical Status
Clustered regularly interspaced short palindromic repeats (CRISPR) and CRISPR-associated endonuclease 9 (Cas9) revolutionized targeted genome editing by coupling programmable single-guide RNAs (sgRNAs) to RNA-guided blunt-end DNA cleavage. In clinical trials for sickle cell disease, 95% of treated patients (29 of 30) achieved complete freedom from vaso-occlusive crises for at least 12 consecutive months following exa-cel infusion. However, ex vivo approaches require intensive myeloablative conditioning with busulfan, exposing patients to significant systemic toxicities, secondary malignancy risks, and prolonged hospitalizations exceeding 30 to 60 days.`,
        sections: [
          {
            id: 'sec-crispr-1-1',
            title: 'Exa-cel Approval & BCL11A Enhancer Target',
            pageNumber: 1,
            preview: 'Exa-cel approved for sickle cell disease; disrupts BCL11A enhancer to reactivate fetal hemoglobin.'
          },
          {
            id: 'sec-crispr-1-2',
            title: 'Ex Vivo Limitations: Busulfan Myeloablation',
            pageNumber: 1,
            preview: 'Ex vivo therapies require toxic busulfan conditioning and 30-60 day hospital stays.'
          }
        ]
      },
      {
        pageNumber: 2,
        textContent: `2 High-Fidelity Engineered Nucleases and Off-Target Profiling

2.1 The Mechanics of Off-Target Cleavage
Wild-type Streptococcus pyogenes Cas9 (SpCas9) demonstrates tolerable fidelity for laboratory screening, but can cleave unintended genomic loci bearing up to three to five mismatches against the 20-nucleotide sgRNA spacer sequence. Unintended double-stranded breaks (DSBs) can trigger chromosomal translocations, large genomic deletions (>1 megabase), and chromothripsis—a catastrophic event of chromosome shattering and haphazard reassembly that poses oncogenic risks.

2.2 Engineered High-Fidelity Variants
Structural and kinetic investigations into Cas9 conformational checkpoints revealed that non-specific interactions between Cas9 positively charged residues (e.g., N497, R661, Q695, Q926) and the negatively charged DNA phosphate backbone stabilize mismatched sgRNA-DNA duplexes. Re-engineering these contact residues yielded second-generation variants:
- SpCas9-HF1: Quadruple mutant (N497A/R661A/Q695A/Q926A) that decreases non-specific contact energy, eliminating detectable off-target cleavage at >85% of verified sites.
- eSpCas9(1.1): Weakens non-target strand binding, showing dramatic off-target reductions while retaining 90% wild-type on-target cleavage rates.
- HiFi Cas9: Single point mutation (R691A) engineered through bacterial screening, exhibiting the optimal balance of high on-target efficacy (>95%) and undetectable off-target indels in primary human cells.

2.3 Unbiased Off-Target Discovery Technologies
Relying on in silico prediction algorithms (such as COSMID or CFD scoring) fails to identify up to 40% of authentic cellular off-target sites due to epigenetic and chromatin accessibility differences. Contemporary clinical programs require empirical, genome-wide cellular assays, most notably GUIDE-seq (Genome-wide Unbiased Identification of DSBs Enabled by sequencing), DISCOVER-seq (which captures endogenous repair protein MRE11 recruitment), and CIRCLE-seq (an in vitro circular cleavage assay).`,
        sections: [
          {
            id: 'sec-crispr-2-1',
            title: '2.1 Off-Target Risks: Chromothripsis and Translocations',
            pageNumber: 2,
            preview: 'Wild-type Cas9 tolerates 3-5 mismatches, risking chromosomal translocations and chromothripsis.'
          },
          {
            id: 'sec-crispr-2-2',
            title: '2.2 Engineered Variants: HiFi Cas9 (R691A) and SpCas9-HF1',
            pageNumber: 2,
            preview: 'HiFi Cas9 with R691A maintains >95% on-target editing with undetectable off-target cuts.'
          }
        ]
      },
      {
        pageNumber: 3,
        textContent: `3 In Vivo Delivery Modalities: Overcoming the Hepatic Barrier

3.1 Viral Vectors versus Non-Viral Vehicles
Adeno-associated virus (AAV) vectors have historically served as the benchmark in vivo delivery system. However, AAV packaging capacity is strictly capped at approximately 4.7 kilobases, barely accommodating the 4.1 kb SpCas9 cDNA plus promoter and sgRNA cassettes. Furthermore, prolonged AAV episomal expression (lasting months to years) drastically escalates off-target accumulation and provokes robust neutralizing antibody and cytotoxic T-lymphocyte responses against viral capsids and bacterial Cas9 epitopes.

3.2 Lipid Nanoparticle (LNP) Encapsulation
Non-viral delivery of synthetic mRNA encoding Cas9 alongside chemically modified sgRNAs packaged within lipid nanoparticles (LNPs) has emerged as the premier clinical approach. LNPs provide transient Cas9 expression (with mRNA half-life < 24 hours), confining endonuclease activity to a brief window that virtually eliminates off-target events.
Standard ionizable cationic lipids (such as ALC-0315 or MC3) naturally absorb serum apolipoprotein E (ApoE) upon intravenous injection, directing over 80% to 90% of circulating LNPs to low-density lipoprotein (LDL) receptors on hepatocytes. While advantageous for hepatic targets such as transthyretin amyloidosis (NTLA-2001) and heterozygous familial hypercholesterolemia (PCSK9), extrahepatic delivery requires specialized redirection chemistry.

3.3 Selective Organ Targeting (SORT) Technology
Engineered SORT lipids systematically reprogram LNP biodistribution without modifying targeting antibodies:
- Lung-targeted SORT LNPs: Incorporation of 20% to 50% 1,2-dioleoyl-3-trimethylammonium-propane (DOTAP) redirects nanoparticles specifically to pulmonary endothelial and epithelial cells.
- Spleen-targeted SORT LNPs: Incorporation of anionic lipids such as 1,2-dioleoyl-sn-glycero-3-phosphate (18PA) shifts delivery to splenic B- and T-lymphocytes.
- Bone marrow homing: Formulations utilizing antibody-conjugated lipids targeting CD117 (c-Kit) are demonstrating preclinical success in achieving in vivo gene editing of hematopoietic stem cells, potentially obsoleting toxic busulfan conditioning.`,
        sections: [
          {
            id: 'sec-crispr-3-1',
            title: '3.1 Viral (AAV) vs Non-Viral (LNP) Delivery',
            pageNumber: 3,
            preview: 'LNPs provide transient <24h expression, avoiding persistent Cas9 exposure and off-target build-up.'
          },
          {
            id: 'sec-crispr-3-2',
            title: '3.3 SORT Lipids for Lung & Spleen Delivery',
            pageNumber: 3,
            preview: 'SORT lipids (DOTAP for lung, 18PA for spleen) overcome hepatic tropism without antibodies.'
          }
        ]
      },
      {
        pageNumber: 4,
        textContent: `4 Immunogenicity, Base Editing, and Future Directions

4.1 Pre-existing Human Immunity to Bacterial Cas Proteins
Because Streptococcus pyogenes and Staphylococcus aureus are ubiquitous human pathogens, epidemiologic surveys reveal that 58% to 78% of healthy adult donors harbor pre-existing IgG antibodies against SpCas9 or SaCas9, and up to 35% possess antigen-specific CD8+ and CD4+ memory T cells. While transient LNP delivery significantly mitigates systemic shock compared to viral vectors, clinical monitoring for hepatic transaminase spikes and anti-Cas9 antibody seroconversion remains obligatory.

4.2 The Ascent of Base and Prime Editing
To circumvent the risks inherent in double-stranded DNA breaks altogether, precision gene editing has progressed toward:
1. Base Editors (CBE and ABE): Deaminases fused to catalytically impaired Cas9 nickase (Cas9n) that convert C->T or A->G without introducing double-stranded breaks, virtually eliminating translocations.
2. Prime Editing: Reverse transcriptase fused to Cas9n guided by prime editing guide RNAs (pegRNAs), enabling all 12 possible base-to-base conversions, small insertions, and targeted deletions up to several hundred base pairs.

Conclusion
The transition of CRISPR technology from ex vivo cell therapies to systemic in vivo medicines marks a defining era in precision therapeutics. By combining engineered high-fidelity Cas variants (e.g., HiFi Cas9), transient LNP formulations, and organ-selective SORT lipids, the field is steadily addressing safety and delivery challenges, bringing one-time curative gene therapies within reach for millions of patients worldwide.`,
        sections: [
          {
            id: 'sec-crispr-4-1',
            title: '4.1 Pre-existing Human Anti-Cas9 Immunity (58-78% seroprevalence)',
            pageNumber: 4,
            preview: 'Over half of healthy donors possess antibodies to bacterial Cas9, requiring transient delivery.'
          },
          {
            id: 'sec-crispr-4-2',
            title: '4.2 Base and Prime Editing Beyond Double-Stranded Breaks',
            pageNumber: 4,
            preview: 'Deaminases and reverse transcriptase avoid double-stranded breaks, eliminating translocations.'
          }
        ]
      }
    ]
  }
];

export const INITIAL_SAMPLE_SESSION = {
  id: 'session-transformer-deep-dive',
  title: 'Transformer Architecture & Scaling Analysis',
  createdAt: '2026-10-18T11:20:00Z',
  updatedAt: '2026-10-22T14:45:00Z',
  documentIds: ['doc-attention-2017'],
  messages: [
    {
      id: 'msg-sample-1',
      role: 'user' as const,
      timestamp: '2026-10-22T14:40:00Z',
      content: 'What makes the Transformer architecture faster to train than recurrent neural networks, and what BLEU score did it achieve?'
    },
    {
      id: 'msg-sample-2',
      role: 'assistant' as const,
      timestamp: '2026-10-22T14:41:15Z',
      content:
        'The Transformer achieves vastly superior training speeds primarily by eliminating the fundamental sequential bottleneck of recurrent networks, enabling massive parallelization during training across all token positions simultaneously. On benchmark translation tasks, the Transformer (big) established a new state-of-the-art score of 28.4 BLEU on English-to-German and 41.8 BLEU on English-to-French.',
      structuredAnswer: {
        summary:
          'Recurrent architectures (LSTMs/GRUs) generate hidden states sequentially ($h_t$ depends on $h_{t-1}$), which strictly forbids parallelizing computation within training sequences. In contrast, the Transformer connects all positions with $O(1)$ sequential operations using self-attention and reduces path length between distant tokens to $O(1)$.',
        keyFindings: [
          'Sequential Operations Bottleneck: RNNs require O(n) sequential operations per layer; Self-Attention executes in O(1) sequential steps, unlocking complete GPU parallelization across long sequences.',
          'Path Length for Dependencies: The maximum path length between any two tokens in self-attention is O(1) compared to O(n) in recurrent networks, facilitating the learning of long-range dependencies.',
          'Computational Complexity: When sequence length n is smaller than hidden dimension d (common in translation), self-attention layers are computationally faster than recurrent layers (O(n²·d) vs O(n·d²)).',
          'Benchmark Translation Quality: Achieved 28.4 BLEU on WMT 2014 English-to-German (outperforming all previous ensembles by >2.0 BLEU) and 41.8 BLEU on English-to-French after 3.5 days of training on 8 P100 GPUs.'
        ],
        methodologyOrContext:
          'Evaluated on WMT 2014 English-German (4.5M sentence pairs) and English-French (36M sentence pairs) datasets using Byte-Pair Encoding. The big model utilized N=6 layers, d_model=1024, h=16 heads, and 300,000 training steps.',
        limitationsOrNuances:
          'For extremely long sequences where n > d, standard self-attention complexity grows quadratically (O(n²)), prompting the authors to recommend restricted self-attention mechanisms for large document lengths.',
        evidenceCount: 3,
        hasSufficientEvidence: true
      },
      citations: [
        {
          id: 'cit-attn-1',
          documentId: 'doc-attention-2017',
          documentTitle: 'Attention Is All You Need',
          pageNumber: 1,
          excerpt:
            'Recurrent models typically factor computation along the symbol positions of the input and output sequences... This inherently sequential nature precludes parallelization within training examples... Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU.',
          confidence: 0.98,
          matchedSection: '1 Introduction & Abstract'
        },
        {
          id: 'cit-attn-2',
          documentId: 'doc-attention-2017',
          pageNumber: 4,
          documentTitle: 'Attention Is All You Need',
          excerpt:
            'Table 1: Maximum path lengths, per-layer complexity and minimum number of sequential operations... Self-Attention: Complexity O(n^2 * d), Sequential Operations O(1), Maximum Path Length O(1)... whereas a recurrent layer requires O(n) sequential operations.',
          confidence: 0.99,
          matchedSection: '4 Why Self-Attention (Table 1)'
        },
        {
          id: 'cit-attn-3',
          documentId: 'doc-attention-2017',
          pageNumber: 5,
          documentTitle: 'Attention Is All You Need',
          excerpt:
            'Table 2: Transformer (big) EN-DE BLEU 28.4, EN-FR BLEU 41.8, Training Cost 2.3 * 10^19 FLOPs. Outperforms previous state-of-the-art models on newstest2014 tests at a fraction of the training cost.',
          confidence: 0.97,
          matchedSection: '6.1 Machine Translation (Table 2)'
        }
      ],
      suggestedFollowUps: [
        'How does the Scaled Dot-Product Attention formula prevent vanishing gradients?',
        'Why does the model use sinusoidal positional encoding instead of learned embeddings?',
        'What regularization techniques like label smoothing were applied during training?'
      ]
    }
  ]
};
