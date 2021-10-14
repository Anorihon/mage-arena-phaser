import { GridSizer, Buttons, Label, Pages, Sizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import Database from "../utils/Database";
import GameObject = Phaser.GameObjects.GameObject;


export default class ChooseSquad extends GridSizer {
    private static readonly columnProportions: Array<number> = [.2, .8]
    private static readonly rowProportions: Array<number> = [.3, .7]

    constructor(scene: Phaser.Scene) {
        super(scene, {
            column: 2,
            row: 2,
            columnProportions: ChooseSquad.columnProportions,
            rowProportions: ChooseSquad.rowProportions,
        });

        const db: Database = Database.getInstance();

        // BG
        const { width: screenWidth, height: screenHeight } = this.scene.cameras.main;
        this.addBackground(scene.add.image(
            screenWidth / 2,
            screenHeight / 2,
            'bg')
        );

        // Fractions block
        db.requestFractions().then(() => {
            // Fractions list
            const fractionsButtons: Array<GameObject> = [];
            let firstFractionKey: string = '';

            const squadsPages: Pages = new Pages(scene, {});
            this.add(squadsPages, { column: 0, row: 1 });


            db.fractions.forEach((value, key) => {
                if (!firstFractionKey) {
                    firstFractionKey = value.img;
                }

                fractionsButtons.push(
                    this.createFractionButton(key, value.img)
                );
            });

            const buttons = new Buttons(scene, {
                orientation: 'y',
                type: 'radio',
                buttons: fractionsButtons,
                setValueCallback: (button, value) => {
                    // @ts-ignore
                    button.getElement('text').setColor(value ? '#1DE10D' : 'white');

                    if (value) {
                        const btns: GameObject = squadsPages.currentPage;

                        if (btns) {
                            (btns as Buttons).forEachButtton(button => {
                                (btns as Buttons).setData(button.name, false);
                            });
                        }

                        squadsPages.swapPage(button.name);
                    }
                }
            })
                .setData(firstFractionKey, true)
                .layout();
            scene.add.existing(buttons);
            this.add(buttons, { column: 0, row: 0 });

            // Squads list
            db.fractions.forEach((value, key) => {
                const btns: Array<GameObject> = [];

                value.squads.forEach(squadName => {
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
                scene.add.existing(squadButtons);
                squadsPages.addPage(squadButtons, {
                    key: value.img,
                    align: Phaser.Display.Align.TOP_LEFT,
                    padding: {left: 0, right: 0, top: 0, bottom: 0},
                    expand: true
                });
            });
            squadsPages.swapPage(firstFractionKey);

            this.createHeroesCards();
            this.createCardView();

            this.onResize();
        });

        scene.scale.on('resize', this.onResize, this);
    }

    private createHeroesCards() {
        const MAX_CARDS: number = 6;
        const cards: Array<GameObject> = [];

        const { height: screenHeight } = this.scene.cameras.main;
        const boxHeight: number = screenHeight * ChooseSquad.rowProportions[0];
        const cardHeightMod: number = .85;

        for (let i = 0; i < MAX_CARDS; i++) {
            const card: Phaser.GameObjects.Image = this.scene.add.image(0, 0, 'hero');

            card.displayHeight = boxHeight * cardHeightMod;
            card.scaleX = card.scaleY;

            cards.push(card);
        }

        const heroes = new Buttons(this.scene, {
            orientation: 'x',
            align: 'center',
            space: { left: 0, right: 0, top: 0, bottom: 0, item: 10 },
            buttons: cards,
            expand: false
        })
            .layout();

        heroes.on('button.click', (button: GameObject, index: number) => {
            console.log(`Click on card #${index}`);
        }, this);

        this.add(heroes, { column: 1, row: 0 });
    }

    private createCardView() {
        const { height: screenHeight } = this.scene.cameras.main;

        const box: Sizer = new Sizer(this.scene, {
            orientation: 0,
            space: { left: 0, right: 0, top: 0, bottom: 0, item: 10 },
        });
        const boxHeight: number = screenHeight * ChooseSquad.rowProportions[1];
        const cardHeightMod: number = .85;
        const card: Phaser.GameObjects.Image = this.scene.add.image(0, 0, 'hero');

        card.displayHeight = boxHeight * cardHeightMod;
        card.scaleX = card.scaleY;

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
            .add(card)
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