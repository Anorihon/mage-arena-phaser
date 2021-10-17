import { GridSizer, Buttons, Label, Pages, Sizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import Database from "../utils/Database";
import GameObject = Phaser.GameObjects.GameObject;


export default class ChooseSquad extends GridSizer {
    private static readonly columnProportions: Array<number> = [.2, .8];
    private static readonly rowProportions: Array<number> = [.3, .7];
    private cards: Array<Phaser.GameObjects.Image> = [];
    private fullViewCard: Phaser.GameObjects.Image;

    private readonly MAX_HEROES: number = 6;
    private heroes: Buttons;

    constructor(scene: Phaser.Scene) {
        super(scene, {
            column: 2,
            row: 2,
            columnProportions: ChooseSquad.columnProportions,
            rowProportions: ChooseSquad.rowProportions,
        });

        // BG
        const { width: screenWidth, height: screenHeight } = this.scene.cameras.main;
        this.addBackground(scene.add.image(
            screenWidth / 2,
            screenHeight / 2,
            'bg')
        );


        this.createHeroesCards();
        this.createCardView();

        // Fractions list
        const fractions = Database.getFractions();
        const fractionsButtons: Array<GameObject> = [];
        let firstFractionKey: string = '';

        const squadsPages: Pages = new Pages(scene, {});
        squadsPages.on('pagevisible', (btns: Buttons) => {
            if (btns) {
                btns.emitButtonClick(0);
            }
        });
        this.add(squadsPages, { column: 0, row: 1 });

        fractions.forEach(fraction => {
            if (!firstFractionKey) {
                firstFractionKey = fraction.img;
            }

            fractionsButtons.push(
                this.createFractionButton(fraction.shortName ? fraction.shortName : fraction.name, fraction.img)
            );
        });

        // Fractions Icons
        const fractionsIcons = new Buttons(scene, {
            orientation: 'y',
            type: 'radio',
            buttons: fractionsButtons,
            setValueCallback: (button, value) => {
                // @ts-ignore
                button.getElement('text').setColor(value ? '#1DE10D' : 'white');

                if (value) {
                    squadsPages.swapPage(button.name);
                }
            }
        })
            .layout();
        fractionsIcons.emitButtonClick(0);
        this.add(fractionsIcons, { column: 0, row: 0 });

        // Squads list
        fractions.forEach(fraction => {
            const btns: Array<GameObject> = [];

            fraction.squads.forEach(squadName => {
                btns.push(
                    this.createSquadButton(squadName)
                );
            });

            const squadButtons: Buttons = new Buttons(scene, {
                orientation: 'y',
                type: 'radio',
                buttons: btns,
                setValueCallback: (button, value) => {
                    // @ts-ignore
                    button.getElement('text').setColor(value ? '#1DE10D' : 'white');
                }
            })
                .layout();

            squadButtons.on('button.click', (button: GameObject, index: number) => {
                // @ts-ignore
                const squadName: string = button.getElement('text').text;
                const units = Database.getSquadUnits(squadName);
                const loadCount = Database.loadCards(units);
                const cards: Array<string> = [];

                units.forEach(unit => {
                    cards.push(`hero-${unit.pic}`);
                });

                this.hideHeroesCards();

                if (loadCount > 0) {
                    this.scene.load.once('complete', () => {
                        this.showHeroesCards(cards);
                    });
                    this.scene.load.start();
                } else {
                    this.showHeroesCards(cards);
                }
            }, this);

            squadsPages.addPage(squadButtons, {
                key: fraction.img,
                align: Phaser.Display.Align.TOP_LEFT,
                padding: {left: 0, right: 0, top: 0, bottom: 0},
                expand: true
            });
        });
        squadsPages.swapPage(firstFractionKey);

        this.onResize();

        scene.scale.on('resize', this.onResize, this);
    }

    showHeroesCards(cards: Array<string>) {
        cards.forEach((card, index) => {
            const button = this.heroes.getButton(index);

            (button as Phaser.GameObjects.Image).setTexture(card);
            this.heroes.showButton(index);
        });

        this.heroes.layout();
        this.heroes.emitButtonClick(0);
    }

    private hideHeroesCards() {
        this.heroes.forEachButtton((button, index) => {
            this.heroes.hideButton(index);
        });
        this.heroes.layout();
    }

    private createHeroesCards() {
        const { height: screenHeight } = this.scene.cameras.main;
        const boxHeight: number = screenHeight * ChooseSquad.rowProportions[0];
        const cardHeightMod: number = .85;

        for (let i = 0; i < this.MAX_HEROES; i++) {
            const card: Phaser.GameObjects.Image = this.scene.add.image(0, 0, 'hero');

            card.displayHeight = boxHeight * cardHeightMod;
            card.scaleX = card.scaleY;

            this.cards.push(card);
        }

        this.heroes = new Buttons(this.scene, {
            orientation: 'x',
            align: 'center',
            space: { left: 0, right: 0, top: 0, bottom: 0, item: 10 },
            buttons: this.cards,
            expand: false
        })
            .layout();

        this.heroes.on('button.click', (card: Phaser.GameObjects.Image) => {
            if (this.fullViewCard) {
                this.fullViewCard.setTexture(card.texture.key);
                this.fullViewCard.setVisible(true);
            }
        }, this);

        this.add(this.heroes, { column: 1, row: 0 });
        this.hideHeroesCards();
    }

    private createCardView() {
        const { height: screenHeight } = this.scene.cameras.main;

        const box: Sizer = new Sizer(this.scene, {
            orientation: 0,
            space: { left: 0, right: 0, top: 0, bottom: 0, item: 10 },
        });
        const boxHeight: number = screenHeight * ChooseSquad.rowProportions[1];
        const cardHeightMod: number = .85;
        
        this.fullViewCard = this.scene.add.image(0, 0, 'hero');
        this.fullViewCard.displayHeight = boxHeight * cardHeightMod;
        this.fullViewCard.scaleX = this.fullViewCard.scaleY;
        this.fullViewCard.setVisible(false);

        const button: Label = new Label(this.scene, {
            width: 200,
            height: 60,
            align: 'center',
            orientation: 0,
            background: this.scene.add.image(0, 0, 'button'),
            text: this.scene.add.text(0, 0, 'Выбрать', {
                fontSize: '24px'
            }),
        });

        button.setInteractive();
        button.on('pointerup', () => {
            console.log('SELECT CARD');
        });

        box
            .add(this.fullViewCard)
            .add(button)
            .layout();

        this.add(box, { column: 1, row: 1 });
    }

    private createSquadButton(text: string, key: string = text): GameObject {
        return new Label(this.scene,{
            width: 100,
            height: 40,
            // expandTextWidth: true,
            // expandTextHeight: true,
            text: this.scene.add.text(0, 0, text, {
                fontSize: '16px'
            }),
            name: key
        });
    }

    private createFractionButton(text: string, name: string = text): GameObject {
        const icon: Phaser.GameObjects.Image = this.scene.add
            .image(0, 0, 'fractions', name)
            .setScale(.6);

        return new Label(this.scene,{
            width: 100,
            height: 40,
            // expandTextWidth: true,
            // expandTextHeight: true,
            text: this.scene.add.text(0, 0, text, {
                fontSize: '16px'
            }),
            icon: icon,
            space: {
                left: 10,
                right: 10,
                icon: 10
            },

            name: name
        });
    }

    onResize() {
        const { width: screenWidth, height: screenHeight } = this.scene.cameras.main;
        const centerX: number = screenWidth / 2;
        const centerY: number = screenHeight / 2;

        this
            .setPosition(centerX, centerY)
            .setMinSize(screenWidth, screenHeight)
            .layout();
    }
}