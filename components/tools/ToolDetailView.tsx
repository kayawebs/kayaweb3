import Link from "next/link";
import { notFound } from "next/navigation";

import AddTimeToDateTool from "@/components/tools/AddTimeToDateTool";
import AgeCalculatorExactTool from "@/components/tools/AgeCalculatorExactTool";
import AbiDecodeTool from "@/components/tools/AbiDecodeTool";
import AbiEncodeTool from "@/components/tools/AbiEncodeTool";
import AiTokenEstimatorTool from "@/components/tools/AiTokenEstimatorTool";
import Base64EncodeDecodeTool from "@/components/tools/Base64EncodeDecodeTool";
import Base64ToImageTool from "@/components/tools/Base64ToImageTool";
import BatchBtcAddressGeneratorTool from "@/components/tools/BatchBtcAddressGeneratorTool";
import BtcAddressGeneratorTool from "@/components/tools/BtcAddressGeneratorTool";
import BtcAddressValidatorTool from "@/components/tools/BtcAddressValidatorTool";
import BtcChangeOutputCalculatorTool from "@/components/tools/BtcChangeOutputCalculatorTool";
import BtcFeeCalculatorTool from "@/components/tools/BtcFeeCalculatorTool";
import BtcFeeEstimatorTool from "@/components/tools/BtcFeeEstimatorTool";
import BtcLocktimeCalculatorTool from "@/components/tools/BtcLocktimeCalculatorTool";
import BtcRawTransactionParserTool from "@/components/tools/BtcRawTransactionParserTool";
import BtcSatoshiConverterTool from "@/components/tools/BtcSatoshiConverterTool";
import BtcScriptDecoderTool from "@/components/tools/BtcScriptDecoderTool";
import BtcTransactionDecoderTool from "@/components/tools/BtcTransactionDecoderTool";
import BtcDustLimitCalculatorTool from "@/components/tools/BtcDustLimitCalculatorTool";
import BtcTransactionSizeCalculatorTool from "@/components/tools/BtcTransactionSizeCalculatorTool";
import BtcWeightCalculatorTool from "@/components/tools/BtcWeightCalculatorTool";
import BinaryToTextTool from "@/components/tools/BinaryToTextTool";
import BreakEvenCalculatorTool from "@/components/tools/BreakEvenCalculatorTool";
import BusinessDaysCalculatorTool from "@/components/tools/BusinessDaysCalculatorTool";
import ContractBytecodeAnalyzerTool from "@/components/tools/ContractBytecodeAnalyzerTool";
import CompoundInterestCalculatorTool from "@/components/tools/CompoundInterestCalculatorTool";
import CountdownTimerDateTool from "@/components/tools/CountdownTimerDateTool";
import CurrentTimestampTool from "@/components/tools/CurrentTimestampTool";
import CurrencyConverterTool from "@/components/tools/CurrencyConverterTool";
import CsvToJsonConverterTool from "@/components/tools/CsvToJsonConverterTool";
import CalldataDecoderTool from "@/components/tools/CalldataDecoderTool";
import ChatFormatConverterTool from "@/components/tools/ChatFormatConverterTool";
import ClickSpeedTestTool from "@/components/tools/ClickSpeedTestTool";
import CoinFlipSimulatorTool from "@/components/tools/CoinFlipSimulatorTool";
import CodeExplainerLiteTool from "@/components/tools/CodeExplainerLiteTool";
import DateDifferenceCalculatorTool from "@/components/tools/DateDifferenceCalculatorTool";
import DateFormatConverterTool from "@/components/tools/DateFormatConverterTool";
import DateStringParserTool from "@/components/tools/DateStringParserTool";
import DateToWeekNumberTool from "@/components/tools/DateToWeekNumberTool";
import DayOfYearCalculatorTool from "@/components/tools/DayOfYearCalculatorTool";
import DcaInvestmentCalculatorTool from "@/components/tools/DcaInvestmentCalculatorTool";
import DiscountCalculatorTool from "@/components/tools/DiscountCalculatorTool";
import EvmAddressCheckerTool from "@/components/tools/EvmAddressCheckerTool";
import EvmChecksumConverterTool from "@/components/tools/EvmChecksumConverterTool";
import EventLogDecoderTool from "@/components/tools/EventLogDecoderTool";
import FileSizeConverterTool from "@/components/tools/FileSizeConverterTool";
import ExchangeRateHistoryViewerTool from "@/components/tools/ExchangeRateHistoryViewerTool";
import GasOptimizationAnalyzerTool from "@/components/tools/GasOptimizationAnalyzerTool";
import Game2048Tool from "@/components/tools/Game2048Tool";
import HashGeneratorMd5Sha256Tool from "@/components/tools/HashGeneratorMd5Sha256Tool";
import HexToStringConverterTool from "@/components/tools/HexToStringConverterTool";
import ImageCompressTool from "@/components/tools/ImageCompressTool";
import ImageCropTool from "@/components/tools/ImageCropTool";
import ImageFormatConverterTool from "@/components/tools/ImageFormatConverterTool";
import ImageResizeTool from "@/components/tools/ImageResizeTool";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";
import InflationCalculatorTool from "@/components/tools/InflationCalculatorTool";
import JsonEscapeUnescapeTool from "@/components/tools/JsonEscapeUnescapeTool";
import JsonDiffViewerTool from "@/components/tools/JsonDiffViewerTool";
import JsonFlattenTool from "@/components/tools/JsonFlattenTool";
import JsonFormatterTool from "@/components/tools/JsonFormatterTool";
import JsonMinifierTool from "@/components/tools/JsonMinifierTool";
import JsonToPromptTool from "@/components/tools/JsonToPromptTool";
import JsonToCsvConverterTool from "@/components/tools/JsonToCsvConverterTool";
import JsonValidatorTool from "@/components/tools/JsonValidatorTool";
import JpgToPngTool from "@/components/tools/JpgToPngTool";
import JwtDecoderTool from "@/components/tools/JwtDecoderTool";
import Keccak256HashGeneratorTool from "@/components/tools/Keccak256HashGeneratorTool";
import KeywordExtractorTool from "@/components/tools/KeywordExtractorTool";
import LeapYearCheckerTool from "@/components/tools/LeapYearCheckerTool";
import LineSorterTool from "@/components/tools/LineSorterTool";
import LoanPaymentCalculatorTool from "@/components/tools/LoanPaymentCalculatorTool";
import MarkdownPreviewTool from "@/components/tools/MarkdownPreviewTool";
import MortgageCalculatorTool from "@/components/tools/MortgageCalculatorTool";
import MultiChainTxViewerTool from "@/components/tools/MultiChainTxViewerTool";
import NetProfitMarginCalculatorTool from "@/components/tools/NetProfitMarginCalculatorTool";
import NonceCheckerTool from "@/components/tools/NonceCheckerTool";
import NumberGuessingGameTool from "@/components/tools/NumberGuessingGameTool";
import OrdinalFeeEstimatorTool from "@/components/tools/OrdinalFeeEstimatorTool";
import OrdinalInscriptionBuilderTool from "@/components/tools/OrdinalInscriptionBuilderTool";
import OrdinalSizeCalculatorTool from "@/components/tools/OrdinalSizeCalculatorTool";
import DuplicateLineRemoverTool from "@/components/tools/DuplicateLineRemoverTool";
import PercentageCalculatorTool from "@/components/tools/PercentageCalculatorTool";
import PdfCompressTool from "@/components/tools/PdfCompressTool";
import PdfMergeTool from "@/components/tools/PdfMergeTool";
import PdfSplitTool from "@/components/tools/PdfSplitTool";
import PdfToImageTool from "@/components/tools/PdfToImageTool";
import PriceImpactCalculatorTool from "@/components/tools/PriceImpactCalculatorTool";
import ProfitLossCalculatorTool from "@/components/tools/ProfitLossCalculatorTool";
import PromptFormatterTool from "@/components/tools/PromptFormatterTool";
import PromptTemplateGeneratorTool from "@/components/tools/PromptTemplateGeneratorTool";
import PsbtBuilderTool from "@/components/tools/PsbtBuilderTool";
import PsbtAnalyzerTool from "@/components/tools/PsbtAnalyzerTool";
import PsbtDecoderTool from "@/components/tools/PsbtDecoderTool";
import PngToJpgTool from "@/components/tools/PngToJpgTool";
import RandomStringGeneratorTool from "@/components/tools/RandomStringGeneratorTool";
import ReactionTimeTestTool from "@/components/tools/ReactionTimeTestTool";
import RandomDecisionMakerTool from "@/components/tools/RandomDecisionMakerTool";
import RandomGradientGeneratorTool from "@/components/tools/RandomGradientGeneratorTool";
import RandomColorGeneratorTool from "@/components/tools/RandomColorGeneratorTool";
import RandomNumberGeneratorTool from "@/components/tools/RandomNumberGeneratorTool";
import RandomPasswordGeneratorTool from "@/components/tools/RandomPasswordGeneratorTool";
import DiceRollSimulatorTool from "@/components/tools/DiceRollSimulatorTool";
import RecoverAddressFromSignatureTool from "@/components/tools/RecoverAddressFromSignatureTool";
import RegexReplaceTool from "@/components/tools/RegexReplaceTool";
import RegexTesterTool from "@/components/tools/RegexTesterTool";
import RecentToolTracker from "@/components/tools/RecentToolTracker";
import RoiCalculatorTool from "@/components/tools/RoiCalculatorTool";
import SignatureVerifierTool from "@/components/tools/SignatureVerifierTool";
import SimpleInterestCalculatorTool from "@/components/tools/SimpleInterestCalculatorTool";
import SubtractTimeFromDateTool from "@/components/tools/SubtractTimeFromDateTool";
import SudokuGeneratorTool from "@/components/tools/SudokuGeneratorTool";
import SlugGeneratorTool from "@/components/tools/SlugGeneratorTool";
import SlippageCalculatorTool from "@/components/tools/SlippageCalculatorTool";
import StockAveragePriceCalculatorTool from "@/components/tools/StockAveragePriceCalculatorTool";
import StringToHexConverterTool from "@/components/tools/StringToHexConverterTool";
import TaxCalculatorTool from "@/components/tools/TaxCalculatorTool";
import TextToBinaryTool from "@/components/tools/TextToBinaryTool";
import TimeDifferenceCalculatorTool from "@/components/tools/TimeDifferenceCalculatorTool";
import TimeDurationCalculatorTool from "@/components/tools/TimeDurationCalculatorTool";
import TextToMarkdownTool from "@/components/tools/TextToMarkdownTool";
import TextSummarizerLiteTool from "@/components/tools/TextSummarizerLiteTool";
import TextCaseConverterTool from "@/components/tools/TextCaseConverterTool";
import TextDiffCheckerTool from "@/components/tools/TextDiffCheckerTool";
import TypingSpeedTestTool from "@/components/tools/TypingSpeedTestTool";
import TimestampConverter from "@/components/tools/TimestampConverter";
import TimestampMillisecondsConverterTool from "@/components/tools/TimestampMillisecondsConverterTool";
import TimezoneConverterTool from "@/components/tools/TimezoneConverterTool";
import TimezoneDifferenceCalculatorTool from "@/components/tools/TimezoneDifferenceCalculatorTool";
import TokenDecimalsConverterTool from "@/components/tools/TokenDecimalsConverterTool";
import TransactionAnalyzerTool from "@/components/tools/TransactionAnalyzerTool";
import TransactionDecoderTool from "@/components/tools/TransactionDecoderTool";
import ToolLocaleSwitcher from "@/components/tools/ToolLocaleSwitcher";
import UnicodeConverterTool from "@/components/tools/UnicodeConverterTool";
import UnitConverterBytesTool from "@/components/tools/UnitConverterBytesTool";
import UrlEncodeDecodeTool from "@/components/tools/UrlEncodeDecodeTool";
import UuidGeneratorTool from "@/components/tools/UuidGeneratorTool";
import VatCalculatorTool from "@/components/tools/VatCalculatorTool";
import WeiEthConverterTool from "@/components/tools/WeiEthConverterTool";
import ArbitrageProfitCalculatorTool from "@/components/tools/ArbitrageProfitCalculatorTool";
import GasFeeCalculatorTool from "@/components/tools/GasFeeCalculatorTool";
import LiquidationRiskCalculatorTool from "@/components/tools/LiquidationRiskCalculatorTool";
import MemoryGameTool from "@/components/tools/MemoryGameTool";
import OracleDelayAnalyzerTool from "@/components/tools/OracleDelayAnalyzerTool";
import SavingsGrowthCalculatorTool from "@/components/tools/SavingsGrowthCalculatorTool";
import SpinWheelPickerTool from "@/components/tools/SpinWheelPickerTool";
import WorkingDaysExcludeWeekendsTool from "@/components/tools/WorkingDaysExcludeWeekendsTool";
import WordCharacterCounterTool from "@/components/tools/WordCharacterCounterTool";
import XmlToJsonConverterTool from "@/components/tools/XmlToJsonConverterTool";
import YamlToJsonConverterTool from "@/components/tools/YamlToJsonConverterTool";
import ImageToBase64Tool from "@/components/tools/ImageToBase64Tool";
import {
  getLocalizedInternalLinks,
  getLocalizedRelatedTools,
  getLocalizedTool,
  getToolJsonLd,
  getToolPageContent,
  getToolPath,
  getToolUiText,
  type ToolLocale,
} from "@/lib/tool-i18n";

type ToolDetailViewProps = {
  locale: ToolLocale;
  slug: string;
};

export default function ToolDetailView({ locale, slug }: ToolDetailViewProps) {
  const tool = getLocalizedTool(slug, locale);
  if (!tool) {
    notFound();
  }

  const content = getToolPageContent(slug, locale);
  if (!content) {
    notFound();
  }

  const relatedTools = getLocalizedRelatedTools(slug, locale);
  const internalLinks = getLocalizedInternalLinks(tool.category, locale);
  const ui = getToolUiText(locale);
  const jsonLd = getToolJsonLd(slug, locale);
  const toolUi = {
    "timestamp-converter": <TimestampConverter locale={locale} />,
    "current-timestamp": <CurrentTimestampTool locale={locale} />,
    "timestamp-milliseconds-converter": <TimestampMillisecondsConverterTool locale={locale} />,
    "date-difference-calculator": <DateDifferenceCalculatorTool locale={locale} />,
    "time-difference-calculator": <TimeDifferenceCalculatorTool locale={locale} />,
    "add-time-to-date": <AddTimeToDateTool locale={locale} />,
    "subtract-time-from-date": <SubtractTimeFromDateTool locale={locale} />,
    "business-days-calculator": <BusinessDaysCalculatorTool locale={locale} />,
    "working-days-exclude-weekends": <WorkingDaysExcludeWeekendsTool locale={locale} />,
    "age-calculator-exact": <AgeCalculatorExactTool locale={locale} />,
    "countdown-timer-date": <CountdownTimerDateTool locale={locale} />,
    "timezone-converter": <TimezoneConverterTool locale={locale} />,
    "timezone-difference-calculator": <TimezoneDifferenceCalculatorTool locale={locale} />,
    "date-to-week-number": <DateToWeekNumberTool locale={locale} />,
    "date-format-converter": <DateFormatConverterTool locale={locale} />,
    "date-string-parser": <DateStringParserTool locale={locale} />,
    "time-duration-calculator": <TimeDurationCalculatorTool locale={locale} />,
    "day-of-year-calculator": <DayOfYearCalculatorTool locale={locale} />,
    "leap-year-checker": <LeapYearCheckerTool locale={locale} />,
    "json-formatter": <JsonFormatterTool locale={locale} />,
    "json-minifier": <JsonMinifierTool locale={locale} />,
    "json-validator": <JsonValidatorTool locale={locale} />,
    "json-escape-unescape": <JsonEscapeUnescapeTool locale={locale} />,
    "base64-encode-decode": <Base64EncodeDecodeTool locale={locale} />,
    "binary-to-text": <BinaryToTextTool locale={locale} />,
    "text-to-binary": <TextToBinaryTool locale={locale} />,
    "url-encode-decode": <UrlEncodeDecodeTool locale={locale} />,
    "uuid-generator": <UuidGeneratorTool locale={locale} />,
    "word-character-counter": <WordCharacterCounterTool locale={locale} />,
    "text-case-converter": <TextCaseConverterTool locale={locale} />,
    "slug-generator": <SlugGeneratorTool locale={locale} />,
    "duplicate-line-remover": <DuplicateLineRemoverTool locale={locale} />,
    "line-sorter": <LineSorterTool locale={locale} />,
    "random-string-generator": <RandomStringGeneratorTool locale={locale} />,
    "unicode-converter": <UnicodeConverterTool locale={locale} />,
    "text-diff-checker": <TextDiffCheckerTool locale={locale} />,
    "regex-tester": <RegexTesterTool locale={locale} />,
    "regex-replace-tool": <RegexReplaceTool locale={locale} />,
    "hash-generator-md5-sha256": <HashGeneratorMd5Sha256Tool locale={locale} />,
    "hex-to-string-converter": <HexToStringConverterTool locale={locale} />,
    "string-to-hex-converter": <StringToHexConverterTool locale={locale} />,
    "jwt-decoder": <JwtDecoderTool locale={locale} />,
    "json-flatten-tool": <JsonFlattenTool locale={locale} />,
    "json-diff-viewer": <JsonDiffViewerTool locale={locale} />,
    "json-to-csv-converter": <JsonToCsvConverterTool locale={locale} />,
    "csv-to-json-converter": <CsvToJsonConverterTool locale={locale} />,
    "xml-to-json-converter": <XmlToJsonConverterTool locale={locale} />,
    "yaml-to-json-converter": <YamlToJsonConverterTool locale={locale} />,
    "percentage-calculator": <PercentageCalculatorTool locale={locale} />,
    "discount-calculator": <DiscountCalculatorTool locale={locale} />,
    "profit-loss-calculator": <ProfitLossCalculatorTool locale={locale} />,
    "roi-calculator": <RoiCalculatorTool locale={locale} />,
    "compound-interest-calculator": <CompoundInterestCalculatorTool locale={locale} />,
    "simple-interest-calculator": <SimpleInterestCalculatorTool locale={locale} />,
    "loan-payment-calculator": <LoanPaymentCalculatorTool locale={locale} />,
    "mortgage-calculator": <MortgageCalculatorTool locale={locale} />,
    "dca-investment-calculator": <DcaInvestmentCalculatorTool locale={locale} />,
    "stock-average-price-calculator": <StockAveragePriceCalculatorTool locale={locale} />,
    "tax-calculator": <TaxCalculatorTool locale={locale} />,
    "vat-calculator": <VatCalculatorTool locale={locale} />,
    "currency-converter": <CurrencyConverterTool locale={locale} />,
    "exchange-rate-history-viewer": <ExchangeRateHistoryViewerTool locale={locale} />,
    "inflation-calculator": <InflationCalculatorTool locale={locale} />,
    "savings-growth-calculator": <SavingsGrowthCalculatorTool locale={locale} />,
    "net-profit-margin-calculator": <NetProfitMarginCalculatorTool locale={locale} />,
    "break-even-calculator": <BreakEvenCalculatorTool locale={locale} />,
    "evm-address-checker": <EvmAddressCheckerTool locale={locale} />,
    "evm-checksum-converter": <EvmChecksumConverterTool locale={locale} />,
    "token-decimals-converter": <TokenDecimalsConverterTool locale={locale} />,
    "wei-eth-converter": <WeiEthConverterTool locale={locale} />,
    "gas-fee-calculator": <GasFeeCalculatorTool locale={locale} />,
    "transaction-decoder": <TransactionDecoderTool locale={locale} />,
    "calldata-decoder": <CalldataDecoderTool locale={locale} />,
    "event-log-decoder": <EventLogDecoderTool locale={locale} />,
    "abi-encode-tool": <AbiEncodeTool locale={locale} />,
    "abi-decode-tool": <AbiDecodeTool locale={locale} />,
    "keccak256-hash-generator": <Keccak256HashGeneratorTool locale={locale} />,
    "signature-verifier": <SignatureVerifierTool locale={locale} />,
    "recover-address-from-signature": <RecoverAddressFromSignatureTool locale={locale} />,
    "nonce-checker": <NonceCheckerTool locale={locale} />,
    "contract-bytecode-analyzer": <ContractBytecodeAnalyzerTool locale={locale} />,
    "btc-address-generator": <BtcAddressGeneratorTool locale={locale} />,
    "btc-address-validator": <BtcAddressValidatorTool locale={locale} />,
    "batch-btc-address-generator": <BatchBtcAddressGeneratorTool locale={locale} />,
    "btc-transaction-decoder": <BtcTransactionDecoderTool locale={locale} />,
    "btc-raw-transaction-parser": <BtcRawTransactionParserTool locale={locale} />,
    "btc-fee-calculator": <BtcFeeCalculatorTool locale={locale} />,
    "btc-fee-estimator": <BtcFeeEstimatorTool locale={locale} />,
    "btc-satoshi-converter": <BtcSatoshiConverterTool locale={locale} />,
    "btc-script-decoder": <BtcScriptDecoderTool locale={locale} />,
    "btc-transaction-size-calculator": <BtcTransactionSizeCalculatorTool locale={locale} />,
    "btc-change-output-calculator": <BtcChangeOutputCalculatorTool locale={locale} />,
    "btc-dust-limit-calculator": <BtcDustLimitCalculatorTool locale={locale} />,
    "btc-locktime-calculator": <BtcLocktimeCalculatorTool locale={locale} />,
    "btc-weight-calculator": <BtcWeightCalculatorTool locale={locale} />,
    "psbt-builder": <PsbtBuilderTool locale={locale} />,
    "psbt-decoder": <PsbtDecoderTool locale={locale} />,
    "psbt-analyzer": <PsbtAnalyzerTool locale={locale} />,
    "ordinal-inscription-builder": <OrdinalInscriptionBuilderTool locale={locale} />,
    "ordinal-fee-estimator": <OrdinalFeeEstimatorTool locale={locale} />,
    "ordinal-size-calculator": <OrdinalSizeCalculatorTool locale={locale} />,
    "transaction-analyzer": <TransactionAnalyzerTool locale={locale} />,
    "multi-chain-tx-viewer": <MultiChainTxViewerTool locale={locale} />,
    "price-impact-calculator": <PriceImpactCalculatorTool locale={locale} />,
    "slippage-calculator": <SlippageCalculatorTool locale={locale} />,
    "arbitrage-profit-calculator": <ArbitrageProfitCalculatorTool locale={locale} />,
    "oracle-delay-analyzer": <OracleDelayAnalyzerTool locale={locale} />,
    "gas-optimization-analyzer": <GasOptimizationAnalyzerTool locale={locale} />,
    "liquidation-risk-calculator": <LiquidationRiskCalculatorTool locale={locale} />,
    "prompt-formatter": <PromptFormatterTool locale={locale} />,
    "prompt-template-generator": <PromptTemplateGeneratorTool locale={locale} />,
    "text-to-markdown": <TextToMarkdownTool locale={locale} />,
    "markdown-preview": <MarkdownPreviewTool locale={locale} />,
    "json-to-prompt": <JsonToPromptTool locale={locale} />,
    "code-explainer-lite": <CodeExplainerLiteTool locale={locale} />,
    "text-summarizer-lite": <TextSummarizerLiteTool locale={locale} />,
    "keyword-extractor": <KeywordExtractorTool locale={locale} />,
    "ai-token-estimator": <AiTokenEstimatorTool locale={locale} />,
    "chat-format-converter": <ChatFormatConverterTool locale={locale} />,
    "random-decision-maker": <RandomDecisionMakerTool locale={locale} />,
    "random-number-generator": <RandomNumberGeneratorTool locale={locale} />,
    "random-password-generator": <RandomPasswordGeneratorTool locale={locale} />,
    "random-color-generator": <RandomColorGeneratorTool locale={locale} />,
    "random-gradient-generator": <RandomGradientGeneratorTool locale={locale} />,
    "coin-flip-simulator": <CoinFlipSimulatorTool locale={locale} />,
    "dice-roll-simulator": <DiceRollSimulatorTool locale={locale} />,
    "number-guessing-game": <NumberGuessingGameTool locale={locale} />,
    "click-speed-test": <ClickSpeedTestTool locale={locale} />,
    "reaction-time-test": <ReactionTimeTestTool locale={locale} />,
    "typing-speed-test": <TypingSpeedTestTool locale={locale} />,
    "memory-game": <MemoryGameTool locale={locale} />,
    "2048-game": <Game2048Tool locale={locale} />,
    "sudoku-generator": <SudokuGeneratorTool locale={locale} />,
    "spin-wheel-picker": <SpinWheelPickerTool locale={locale} />,
    "jpg-to-png": <JpgToPngTool locale={locale} />,
    "png-to-jpg": <PngToJpgTool locale={locale} />,
    "image-format-converter": <ImageFormatConverterTool locale={locale} />,
    "image-resize-tool": <ImageResizeTool locale={locale} />,
    "image-compress-tool": <ImageCompressTool locale={locale} />,
    "image-crop-tool": <ImageCropTool locale={locale} />,
    "image-to-base64": <ImageToBase64Tool locale={locale} />,
    "base64-to-image": <Base64ToImageTool locale={locale} />,
    "pdf-to-image": <PdfToImageTool locale={locale} />,
    "image-to-pdf": <ImageToPdfTool locale={locale} />,
    "pdf-merge-tool": <PdfMergeTool locale={locale} />,
    "pdf-split-tool": <PdfSplitTool locale={locale} />,
    "pdf-compress-tool": <PdfCompressTool locale={locale} />,
    "file-size-converter": <FileSizeConverterTool locale={locale} />,
    "unit-converter-bytes": <UnitConverterBytesTool locale={locale} />,
  }[tool.slug];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <RecentToolTracker slug={tool.slug} />
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
        <section className="terminal-panel space-y-5">
          <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/tools/{tool.slug}</span>
            <span>{tool.status === "ready" ? ui.interactive : ui.scaffold}</span>
          </div>

          <header className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[var(--terminal-muted)]">
                <Link href={getToolPath(locale)} className="hover:text-[var(--foreground)]">
                  /tools
                </Link>
                <span>/</span>
                <span>{tool.slug}</span>
              </div>
              <ToolLocaleSwitcher locale={locale} slug={slug} />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">{content.title}</h1>
            <p className="max-w-3xl text-sm leading-6 text-[var(--foreground)]/85">{content.intro}</p>
          </header>
        </section>

        {toolUi ? (
          toolUi
        ) : (
          <section className="terminal-panel space-y-4">
            <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
              <span className="terminal-accent">~/tools/{tool.slug}/ui</span>
              <span>{ui.pending}</span>
            </div>
            <div className="rounded-lg border border-dashed border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-5">
              <p className="text-sm leading-6 text-[var(--foreground)]/85">
                {ui.pendingCopyPrefix}
                <strong>{content.title}</strong>
                {ui.pendingCopySuffix}
              </p>
            </div>
          </section>
        )}

        <section className="terminal-panel space-y-4">
          <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/tools/{tool.slug}/examples</span>
            <span>{ui.usageFile}</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{content.exampleHeading}</h2>
            <ul className="space-y-2 text-sm leading-6 text-[var(--foreground)]/85">
              {content.example.map((item) => (
                <li key={item} className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="terminal-panel space-y-4">
          <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/tools/{tool.slug}/guide</span>
            <span>{ui.guideFile}</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{content.explanationHeading}</h2>
            <p className="text-sm leading-7 text-[var(--foreground)]/85">{content.explanation}</p>
          </div>
        </section>

        <section className="terminal-panel space-y-4">
          <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/tools/{tool.slug}/faq</span>
            <span>{content.faq.length} items</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{content.faqHeading}</h2>
            <div className="space-y-3">
              {content.faq.map((item) => (
                <details key={item.question} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
                  <summary className="cursor-pointer text-sm font-medium">{item.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground)]/80">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="terminal-panel space-y-4">
          <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/tools/{tool.slug}/related</span>
            <span>{relatedTools.length} links</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{content.relatedHeading}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedTools.map((item) => {
                if (!item) return null;

                return (
                  <Link
                    key={item.slug}
                    href={getToolPath(locale, item.slug)}
                    className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 px-4 py-3 transition-colors hover:border-[var(--terminal-accent)]"
                  >
                    <h3 className="text-sm font-semibold">{item.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--terminal-muted)]">{item.summary}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="terminal-panel space-y-4">
          <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/tools/{tool.slug}/links</span>
            <span>{ui.internal}</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{content.internalLinksHeading}</h2>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {internalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex rounded border border-[var(--terminal-border)] px-3 py-2 text-[var(--foreground)]/85 transition-colors hover:border-[var(--terminal-accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
