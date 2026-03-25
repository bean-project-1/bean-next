"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
//
// ───────────────── DIMENSIONS (19 CORRECTAS) ─────────────────
//
var DIMENSIONS = [
    // 🌱 IDENTIDAD
    { name: 'values', label: 'Core Values', category: 'identity' },
    { name: 'personality', label: 'Personality', category: 'identity' },
    { name: 'interests', label: 'Interests', category: 'identity' },
    { name: 'purpose', label: 'Purpose', category: 'identity' },
    { name: 'motivations', label: 'Motivations', category: 'identity' },
    // 🌿 CAPITAL
    { name: 'knowledge', label: 'Knowledge', category: 'capital' },
    { name: 'skills', label: 'Skills', category: 'capital' },
    { name: 'career', label: 'Career', category: 'capital' },
    { name: 'income', label: 'Income', category: 'capital' },
    { name: 'social_capital', label: 'Social Capital', category: 'capital' },
    { name: 'physical_health', label: 'Physical Health', category: 'capital' },
    { name: 'resilience', label: 'Resilience', category: 'capital' },
    // 🌳 EXPERIENCIA
    { name: 'work_satisfaction', label: 'Work Satisfaction', category: 'experience' },
    { name: 'relationships', label: 'Relationships', category: 'experience' },
    { name: 'mental_wellbeing', label: 'Mental Wellbeing', category: 'experience' },
    { name: 'free_time', label: 'Free Time', category: 'experience' },
    { name: 'personal_growth', label: 'Personal Growth', category: 'experience' },
    { name: 'impact', label: 'Impact', category: 'experience' },
    { name: 'financial_security', label: 'Financial Security', category: 'experience' },
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var dimensionMap, i, dim, index, d, user, attributes, _i, attributes_1, attr, inputs, _a, inputs_1, input, goals, _b, goals_1, g, goal, _c, _d, action;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('🌱 BEAN Seed v2 (19 dimensiones correctas)\n');
                    dimensionMap = {};
                    i = 0;
                    _e.label = 1;
                case 1:
                    if (!(i < DIMENSIONS.length)) return [3 /*break*/, 4];
                    dim = DIMENSIONS[i];
                    index = i;
                    return [4 /*yield*/, prisma.dimension.upsert({
                            where: { name: dim.name },
                            update: __assign(__assign({}, dim), { sortOrder: index + 1 }),
                            create: __assign(__assign({}, dim), { sortOrder: index + 1, description: dim.label }),
                        })];
                case 2:
                    d = _e.sent();
                    dimensionMap[dim.name] = d.id;
                    _e.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, prisma.user.upsert({
                        where: { email: 'daniel@bean.app' },
                        update: {},
                        create: {
                            email: 'daniel@bean.app',
                            name: 'Daniel BEAN',
                        },
                    })];
                case 5:
                    user = _e.sent();
                    //
                    // ───────────────── 3. USER ATTRIBUTES (ADN) ─────────────────
                    //
                    console.log('Creating User Attributes...');
                    attributes = [
                        // Identidad
                        { dimension: 'values', name: 'Libertad', category: 'value', metadata: { importance: 95 } },
                        { dimension: 'values', name: 'Impacto Social', category: 'value', metadata: { importance: 90 } },
                        { dimension: 'values', name: 'Autenticidad', category: 'value', metadata: { importance: 85 } },
                        { dimension: 'personality', name: 'Introvertido', category: 'trait', metadata: { level: 70 } },
                        { dimension: 'personality', name: 'Analítico', category: 'trait', metadata: { level: 90 } },
                        { dimension: 'interests', name: 'Ciclismo', category: 'interest', metadata: { frequency: '4x/week' } },
                        { dimension: 'interests', name: 'IA & Futuro', category: 'interest' },
                        { dimension: 'interests', name: 'Filosofía', category: 'interest' },
                        { dimension: 'purpose', name: 'Democratizar Tecnología', category: 'goal' },
                        { dimension: 'purpose', name: 'Sostenibilidad', category: 'goal' },
                        { dimension: 'motivations', name: 'Curiosidad', category: 'driver' },
                        { dimension: 'motivations', name: 'Reconocimiento', category: 'driver' },
                        // Capital
                        { dimension: 'knowledge', name: 'Arquitectura de Software', category: 'expertise', metadata: { level: 'Senior' } },
                        { dimension: 'knowledge', name: 'Historia Moderna', category: 'expertise' },
                        { dimension: 'skills', name: 'Backend (Node.js/Go)', category: 'skill', metadata: { level: 90 } },
                        { dimension: 'skills', name: 'React/Next.js', category: 'skill', metadata: { level: 85 } },
                        { dimension: 'skills', name: 'Public Speaking', category: 'skill', metadata: { level: 60 } },
                        { dimension: 'career', name: 'Senior Developer', category: 'role' },
                        { dimension: 'career', name: 'Team Lead', category: 'aspiration' },
                        { dimension: 'income', name: 'Sueldo Base', category: 'source' },
                        { dimension: 'income', name: 'Inversiones', category: 'source' },
                        { dimension: 'social_capital', name: 'Mentores Tech', category: 'network' },
                        { dimension: 'social_capital', name: 'Comunidad Open Source', category: 'network' },
                        { dimension: 'physical_health', name: 'Resistencia (Endurance)', category: 'skill', metadata: { level: 75 } },
                        { dimension: 'physical_health', name: 'Buena Nutrición', category: 'habit' },
                        { dimension: 'resilience', name: 'Adaptabilidad', category: 'trait' },
                        { dimension: 'resilience', name: 'Gestión de Estrés', category: 'skill', metadata: { level: 80 } },
                        // Experiencia
                        { dimension: 'work_satisfaction', name: 'Autonomía', category: 'factor', metadata: { satisfaction: 9 } },
                        { dimension: 'work_satisfaction', name: 'Reto Técnico', category: 'factor', metadata: { satisfaction: 10 } },
                        { dimension: 'relationships', name: 'Familia', category: 'vital', metadata: { quality: 10 } },
                        { dimension: 'relationships', name: 'Amigos Cercanos', category: 'vital' },
                        { dimension: 'mental_wellbeing', name: 'Meditación', category: 'habit', metadata: { frequency: 'Daily' } },
                        { dimension: 'mental_wellbeing', name: 'Lectura', category: 'habit' },
                        { dimension: 'free_time', name: 'Gaming', category: 'hobby' },
                        { dimension: 'free_time', name: 'Series/Cine', category: 'hobby' },
                        { dimension: 'personal_growth', name: 'Escribir un Blog', category: 'project' },
                        { dimension: 'personal_growth', name: 'Aprender Piano', category: 'aspiration' },
                        { dimension: 'impact', name: 'Voluntariado Tech', category: 'action' },
                        { dimension: 'impact', name: 'Donaciones Locales', category: 'action' },
                        { dimension: 'financial_security', name: 'Fondo de Emergencia', category: 'status', metadata: { completed: true } },
                        { dimension: 'financial_security', name: 'Plan de Retiro', category: 'status' },
                    ];
                    _i = 0, attributes_1 = attributes;
                    _e.label = 6;
                case 6:
                    if (!(_i < attributes_1.length)) return [3 /*break*/, 9];
                    attr = attributes_1[_i];
                    return [4 /*yield*/, prisma.userAttribute.create({
                            data: {
                                userId: user.id,
                                dimensionId: dimensionMap[attr.dimension],
                                name: attr.name,
                                category: attr.category,
                                metadata: attr.metadata,
                            },
                        })];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    //
                    // ───────────────── 4. DIMENSION INPUTS (EVENTOS) ─────────────────
                    //
                    console.log('Creating Inputs...');
                    inputs = [
                        {
                            dimension: 'physical_health',
                            inputType: 'activity',
                            valueJson: { activity: 'cycling', duration: 120 },
                        },
                        {
                            dimension: 'career',
                            inputType: 'learning',
                            valueJson: { topic: 'machine learning', hours: 3 },
                        },
                        {
                            dimension: 'mental_wellbeing',
                            inputType: 'mood',
                            valueJson: { mood: 'stressed', level: 60 },
                        },
                    ];
                    _a = 0, inputs_1 = inputs;
                    _e.label = 10;
                case 10:
                    if (!(_a < inputs_1.length)) return [3 /*break*/, 13];
                    input = inputs_1[_a];
                    return [4 /*yield*/, prisma.dimensionInput.create({
                            data: {
                                userId: user.id,
                                dimensionId: dimensionMap[input.dimension],
                                inputType: input.inputType,
                                valueJson: input.valueJson,
                            },
                        })];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 10];
                case 13:
                    //
                    // ───────────────── 5. GOALS (RAMAS) ─────────────────
                    //
                    console.log('Creating Goals...');
                    goals = [
                        {
                            title: 'Ser Data Scientist',
                            dimension: 'career',
                            progress: 65,
                            actions: [
                                { title: 'Python Basics', isCompleted: true, impact: { career: 3 } },
                                { title: 'ML Project', isCompleted: false, impact: { career: 5 } },
                            ],
                        },
                        {
                            title: 'Correr Maratón',
                            dimension: 'physical_health',
                            progress: 40,
                            actions: [
                                { title: 'Run 10km', isCompleted: true, impact: { health: 3 } },
                                { title: 'Half Marathon', isCompleted: false, impact: { health: 5 } },
                            ],
                        },
                    ];
                    _b = 0, goals_1 = goals;
                    _e.label = 14;
                case 14:
                    if (!(_b < goals_1.length)) return [3 /*break*/, 20];
                    g = goals_1[_b];
                    return [4 /*yield*/, prisma.goal.create({
                            data: {
                                userId: user.id,
                                title: g.title,
                                dimensionId: dimensionMap[g.dimension],
                                progress: g.progress,
                            },
                        })];
                case 15:
                    goal = _e.sent();
                    _c = 0, _d = g.actions;
                    _e.label = 16;
                case 16:
                    if (!(_c < _d.length)) return [3 /*break*/, 19];
                    action = _d[_c];
                    return [4 /*yield*/, prisma.goalAction.create({
                            data: __assign({ goalId: goal.id }, action),
                        })];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18:
                    _c++;
                    return [3 /*break*/, 16];
                case 19:
                    _b++;
                    return [3 /*break*/, 14];
                case 20:
                    //
                    // ───────────────── 6. LIFE STATE (ADN MOCK) ─────────────────
                    //
                    console.log('Creating LifeState...');
                    return [4 /*yield*/, prisma.lifeState.create({
                            data: {
                                userId: user.id,
                                lifeScore: 72,
                                balanceScore: 60,
                                alignmentScore: 80,
                                energyIndex: 65,
                                insights: {
                                    message: 'Buen progreso en carrera, pero necesitas equilibrar bienestar',
                                    focus: 'balance',
                                },
                                scores: [
                                    {
                                        dimensionId: dimensionMap['career'],
                                        score: 80,
                                        trend: 'up',
                                    },
                                    {
                                        dimensionId: dimensionMap['physical_health'],
                                        score: 65,
                                        trend: 'up',
                                    },
                                    {
                                        dimensionId: dimensionMap['mental_wellbeing'],
                                        score: 55,
                                        trend: 'down',
                                    },
                                    {
                                        dimensionId: dimensionMap['work_satisfaction'],
                                        score: 75,
                                        trend: 'stable',
                                    },
                                ],
                            },
                        })];
                case 21:
                    _e.sent();
                    console.log('\n✅ Seed completo y consistente 🌳');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return prisma.$disconnect(); });
